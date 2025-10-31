"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var item_library_1 = require("../../../models/item-library");
var character_1 = require("../../../models/character");
var ItemStorageService = require('../../../services/itemStorageService').ItemStorageService;
Page({
    data: {
        items: [],
        categories: [],
        currentCategory: 'unique',
        filteredItems: [],
        searchKeyword: '',
        sortOrder: 'usage',
        totalItems: 0
    },
    onLoad: function () {
        this.loadItems();
    },
    /**
     * 加载物品数据
     */
    loadItems: function () {
        var _this = this;
        // 从存储服务获取所有物品数据
        var allItems = ItemStorageService.getAllItems();
        // 添加时间格式化
        var processedItems = allItems.map(function (item) {
            var result = (0, character_1.extendObject)({}, item);
            result.createTimeText = _this.formatTime(item.createTime);
            return result;
        });
        // 计算分类数量
        var categories = this.calculateCategories(processedItems);
        // 设置当前分类的物品
        var filteredItems = this.filterAndSortItems(processedItems, this.data.currentCategory, this.data.searchKeyword, this.data.sortOrder);
        this.setData({
            items: processedItems,
            categories: categories,
            filteredItems: filteredItems,
            totalItems: processedItems.length
        });
    },
    /**
     * 计算分类数量
     */
    calculateCategories: function (items) {
        var categories = item_library_1.ITEM_CATEGORIES.map(function (category) {
            var result = (0, character_1.extendObject)({}, category);
            result.count = items.filter(function (item) { return item.category.key === category.key; }).length;
            return result;
        });
        return categories;
    },
    /**
     * 过滤和排序物品
     */
    filterAndSortItems: function (items, category, keyword, sortOrder) {
        var filtered = items;
        // 按分类过滤
        if (category !== 'all') {
            filtered = filtered.filter(function (item) { return item.category.key === category; });
        }
        // 按关键词搜索
        if (keyword) {
            var lowerKeyword_1 = keyword.toLowerCase();
            filtered = filtered.filter(function (item) {
                return item.name.toLowerCase().indexOf(lowerKeyword_1) !== -1;
            });
        }
        // 排序
        filtered.sort(function (a, b) {
            if (sortOrder === 'usage') {
                return b.usageCount - a.usageCount;
            }
            else {
                return b.updateTime - a.updateTime;
            }
        });
        return filtered.map(function (item) {
            var result = (0, character_1.extendObject)({}, item);
            result.createTimeText = this.formatTime(item.createTime);
            return result;
        }.bind(this));
    },
    /**
     * 格式化时间
     */
    formatTime: function (timestamp) {
        var now = Date.now();
        var diff = now - timestamp;
        var days = Math.floor(diff / (24 * 60 * 60 * 1000));
        if (days === 0) {
            var hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours === 0) {
                var minutes = Math.floor(diff / (60 * 1000));
                return minutes === 0 ? '刚刚' : minutes + '分钟前';
            }
            return hours + '小时前';
        }
        else if (days === 1) {
            return '昨天';
        }
        else if (days < 7) {
            return days + '天前';
        }
        else if (days < 30) {
            var weeks = Math.floor(days / 7);
            return weeks + '周前';
        }
        else {
            var date = new Date(timestamp);
            return (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }
    },
    /**
     * 切换分类
     */
    switchCategory: function (e) {
        var category = e.currentTarget.dataset.category;
        var filteredItems = this.filterAndSortItems(this.data.items, category, this.data.searchKeyword, this.data.sortOrder);
        this.setData({
            currentCategory: category,
            filteredItems: filteredItems
        });
    },
    /**
     * 搜索输入
     */
    onSearchInput: function (e) {
        var keyword = e.detail.value;
        this.setData({
            searchKeyword: keyword
        });
        // 实时搜索
        var filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, keyword, this.data.sortOrder);
        this.setData({
            filteredItems: filteredItems
        });
    },
    /**
     * 搜索确认
     */
    onSearchConfirm: function (e) {
        var keyword = e.detail.value;
        var filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, keyword, this.data.sortOrder);
        this.setData({
            filteredItems: filteredItems
        });
    },
    /**
     * 切换排序方式
     */
    toggleSortOrder: function () {
        var newSortOrder = this.data.sortOrder === 'usage' ? 'time' : 'usage';
        var filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, this.data.searchKeyword, newSortOrder);
        this.setData({
            sortOrder: newSortOrder,
            filteredItems: filteredItems
        });
    },
    /**
     * 编辑物品
     */
    editItem: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        if (item.isBuiltIn) {
            wx.showToast({
                title: '内置物品不能编辑',
                icon: 'none'
            });
            return;
        }
        // 显示编辑对话框
        wx.showModal({
            title: '编辑物品',
            editable: true,
            placeholderText: '请输入物品名称',
            content: item.name,
            success: function (res) {
                if (res.confirm && res.content && res.content.trim()) {
                    _this.updateItemName(item, res.content.trim());
                }
            }
        });
    },
    /**
     * 更新物品名称
     */
    updateItemName: function (item, newName) {
        var success = ItemStorageService.updateItem(item.id, { name: newName });
        if (success) {
            // 重新加载数据
            this.loadItems();
        }
    },
    /**
     * 删除物品
     */
    deleteItem: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        if (item.isBuiltIn) {
            wx.showToast({
                title: '内置物品不能删除',
                icon: 'none'
            });
            return;
        }
        wx.showModal({
            title: '确认删除',
            content: "\u786E\u5B9A\u8981\u5220\u9664\u7269\u54C1\"".concat(item.name, "\"\u5417\uFF1F"),
            success: function (res) {
                if (res.confirm) {
                    var success = ItemStorageService.deleteItem(item.id);
                    if (success) {
                        // 重新加载数据
                        _this.loadItems();
                    }
                }
            }
        });
    },
    /**
     * 显示添加物品对话框
     */
    showAddItemDialog: function () {
        // 使用新的item-form组件
        var itemForm = this.selectComponent('#itemForm');
        if (itemForm) {
            itemForm.show();
        }
    },
    /**
     * 处理物品表单确认事件
     */
    onItemFormConfirm: function (e) {
        var formData = e.detail;
        if (formData.mode === 'manage') {
            // 物品管理模式：添加新物品到词库
            var success = ItemStorageService.createItem(formData.name, formData.category);
            if (success) {
                // 重新加载数据
                this.loadItems();
            }
        }
        else {
            // Session记录模式：处理session记录（预留功能）
            console.log('Session记录模式：', formData);
            // TODO: 实现session记录功能
        }
    },
    onShow: function () {
        this.loadItems();
    }
});
