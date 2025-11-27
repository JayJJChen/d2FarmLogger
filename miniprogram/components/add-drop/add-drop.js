"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var item_library_1 = require("../../models/item-library");
var ItemStorageService = require('../../services/itemStorageService').ItemStorageService;
var StorageUtils = require('../../utils/storageUtils');
Component({
    properties: {
        session: {
            type: Object,
            value: null,
            observer: function (newVal) {
                if (newVal)
                    this.init();
            }
        }
    },
    data: {
        step: 1, // 1: Scene, 2: Category, 3: Item
        selectedSceneId: '',
        selectedCategory: null,
        categories: item_library_1.ITEM_CATEGORIES,
        // For item selection
        builtInItems: [],
        userItems: [], // Autocomplete suggestions
        searchText: '',
        note: ''
    },
    methods: {
        init: function () {
            var session = this.properties.session;
            if (session) {
                // If only one scene, skip step 1
                if (session.sceneSnapshots && session.sceneSnapshots.length === 1) {
                    this.setData({
                        selectedSceneId: session.sceneSnapshots[0].id,
                        step: 2
                    });
                }
                else {
                    this.setData({ step: 1 });
                }
            }
            this.setData({
                searchText: '',
                note: '',
                builtInItems: [],
                userItems: []
            });
        },
        onSceneSelect: function (e) {
            var sceneId = e.currentTarget.dataset.id;
            this.setData({
                selectedSceneId: sceneId,
                step: 2
            });
        },
        onCategorySelect: function (e) {
            var categoryKey = e.currentTarget.dataset.key;
            var category = null;
            for (var i = 0; i < item_library_1.ITEM_CATEGORIES.length; i++) {
                if (item_library_1.ITEM_CATEGORIES[i].key === categoryKey) {
                    category = item_library_1.ITEM_CATEGORIES[i];
                    break;
                }
            }
            this.setData({
                selectedCategory: category,
                step: 3,
                searchText: '',
                note: ''
            });
            this.loadItemsForCategory(category);
        },
        loadItemsForCategory: function (category) {
            if (!category)
                return;
            var allItems = ItemStorageService.getAllItems();
            if (category.key === 'rune' || category.key === 'key' || category.key === 'essence') {
                var builtIns = allItems.filter(function (item) {
                    return item.category.key === category.key && item.isBuiltIn;
                });
                this.setData({ builtInItems: builtIns });
            }
            else {
                this.filterUserItems('');
            }
        },
        onSearchInput: function (e) {
            var text = e.detail.value;
            this.setData({ searchText: text });
            this.filterUserItems(text);
        },
        filterUserItems: function (text) {
            var category = this.data.selectedCategory;
            if (!category)
                return;
            var allItems = ItemStorageService.getAllItems();
            var filtered = allItems.filter(function (item) {
                return item.category.key === category.key &&
                    !item.isBuiltIn &&
                    (text ? item.name.indexOf(text) > -1 : true);
            });
            // Sort by usage count
            filtered.sort(function (a, b) { return b.usageCount - a.usageCount; });
            this.setData({ userItems: filtered });
        },
        onBuiltInItemSelect: function (e) {
            var item = e.currentTarget.dataset.item;
            this.saveDrop(item);
        },
        onUserItemSelect: function (e) {
            var item = e.currentTarget.dataset.item;
            this.saveDrop(item);
        },
        onSaveNewItem: function () {
            var name = this.data.searchText;
            if (!name)
                return;
            var category = this.data.selectedCategory;
            // Check duplication in existing items
            var userItems = this.data.userItems;
            for (var i = 0; i < userItems.length; i++) {
                if (userItems[i].name === name) {
                    this.saveDrop(userItems[i]);
                    return;
                }
            }
            var success = ItemStorageService.createItem(name, category);
            if (success) {
                var allItems = ItemStorageService.getAllItems();
                var newItem = null;
                for (var j = 0; j < allItems.length; j++) {
                    if (allItems[j].name === name && allItems[j].category.key === category.key) {
                        newItem = allItems[j];
                        break;
                    }
                }
                if (newItem) {
                    this.saveDrop(newItem);
                }
            }
        },
        onNoteInput: function (e) {
            this.setData({ note: e.detail.value });
        },
        saveDrop: function (item) {
            var session = this.properties.session;
            var sceneId = this.data.selectedSceneId;
            var scene = null;
            for (var i = 0; i < session.sceneSnapshots.length; i++) {
                if (session.sceneSnapshots[i].id === sceneId) {
                    scene = session.sceneSnapshots[i];
                    break;
                }
            }
            if (!scene)
                return;
            ItemStorageService.incrementUsageCount(item.id);
            var drop = {
                id: StorageUtils.generateUniqueId('drop'),
                itemId: item.id,
                itemName: item.name,
                itemCategory: item.category,
                sceneId: scene.id,
                sceneName: scene.name,
                note: this.data.note,
                timestamp: Date.now()
            };
            this.triggerEvent('dropadded', { drop: drop });
        },
        onCancel: function () {
            this.triggerEvent('cancel');
        },
        onBack: function () {
            var step = this.data.step;
            if (step > 1) {
                var session = this.properties.session;
                if (step === 2 && session && session.sceneSnapshots.length === 1) {
                    this.triggerEvent('cancel');
                }
                else {
                    this.setData({ step: step - 1 });
                }
            }
            else {
                this.triggerEvent('cancel');
            }
        }
    }
});
