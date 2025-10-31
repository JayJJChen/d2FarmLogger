// 物品表单组件
// 支持物品管理模式和session记录模式
// 确保ES5兼容性
var ItemLibrary = require('../../models/item-library.js');
var ItemCategory = ItemLibrary.ItemCategory;
var ITEM_CATEGORIES = ItemLibrary.ITEM_CATEGORIES;
var ItemStorageService = require('../../services/itemStorageService.js').ItemStorageService;
// ItemFormData 组件数据接口
// mode: 'manage' | 'session'  // manage: 添加物品到库, session: 记录session掉落
// visible: boolean
// selectedCategory: ItemCategory | null
// itemName: string
// itemNote: string  // 仅session模式使用
// categories: ItemCategory[]  // 根据模式过滤的分类列表
Component({
    /**
     * 组件属性
     */
    properties: {
        mode: {
            type: String,
            value: 'manage'
        }
    },
    /**
     * 组件数据
     */
    data: {
        visible: false,
        selectedCategory: null,
        itemName: '',
        itemNote: '',
        categories: [],
        confirmButtonText: '添加物品',
        titleText: '添加物品'
    },
    /**
     * 组件生命周期
     */
    lifetimes: {
        attached: function () {
            this.initCategories();
        }
    },
    /**
     * 组件方法
     */
    methods: {
        /**
         * 初始化分类列表
         */
        initCategories: function () {
            var mode = this.data.mode;
            var categories = [];
            var confirmButtonText = '添加物品';
            var titleText = '添加物品';
            if (mode === 'manage') {
                // 物品管理模式：排除内置物品分类（符文、钥匙、精华）
                var excludeKeys = ['rune', 'key', 'essence'];
                categories = ITEM_CATEGORIES.filter(function (category) {
                    return excludeKeys.indexOf(category.key) === -1;
                });
                confirmButtonText = '添加物品';
                titleText = '添加物品';
            }
            else {
                // Session记录模式：显示所有分类
                categories = ITEM_CATEGORIES;
                confirmButtonText = '记录掉落';
                titleText = '记录掉落';
            }
            this.setData({
                categories: categories,
                confirmButtonText: confirmButtonText,
                titleText: titleText
            });
        },
        /**
         * 显示表单
         */
        show: function () {
            this.setData({
                visible: true,
                selectedCategory: null,
                itemName: '',
                itemNote: ''
            });
        },
        /**
         * 隐藏表单
         */
        hide: function () {
            this.setData({
                visible: false
            });
        },
        /**
         * 点击遮罩层关闭
         */
        onMaskTap: function () {
            this.hide();
        },
        /**
         * 阻止内容区域点击事件冒泡
         */
        onContentTap: function () {
            // 阻止事件冒泡到遮罩层
        },
        /**
         * 选择分类
         */
        onCategoryTap: function (e) {
            var category = e.currentTarget.dataset.category;
            this.setData({
                selectedCategory: category
            });
        },
        /**
         * 物品名称输入
         */
        onNameInput: function (e) {
            this.setData({
                itemName: e.detail.value
            });
        },
        /**
         * 备注输入（仅session模式）
         */
        onNoteInput: function (e) {
            this.setData({
                itemNote: e.detail.value
            });
        },
        /**
         * 取消操作
         */
        onCancel: function () {
            this.hide();
        },
        /**
         * 确认操作
         */
        onConfirm: function () {
            if (!this.validateForm()) {
                return;
            }
            var formData = {
                mode: this.data.mode,
                category: this.data.selectedCategory,
                name: this.data.itemName.trim(),
                note: this.data.itemNote.trim()
            };
            // 触发确认事件
            this.triggerEvent('confirm', formData);
            // 隐藏表单
            this.hide();
        },
        /**
         * 表单验证
         */
        validateForm: function () {
            if (!this.data.selectedCategory) {
                wx.showToast({
                    title: '请选择物品分类',
                    icon: 'none'
                });
                return false;
            }
            if (!this.data.itemName || !this.data.itemName.trim()) {
                wx.showToast({
                    title: '请输入物品名称',
                    icon: 'none'
                });
                return false;
            }
            // 物品管理模式：检查名称重复
            if (this.data.mode === 'manage') {
                var existingItems = ItemStorageService.getUserItems();
                var self = this;
                var nameExists = existingItems.some(function (item) {
                    return item.category.key === self.data.selectedCategory.key &&
                        item.name === self.data.itemName.trim();
                });
                if (nameExists) {
                    wx.showToast({
                        title: '该分类下已存在相同名称的物品',
                        icon: 'none'
                    });
                    return false;
                }
            }
            return true;
        },
        /**
         * 获取分类显示名称
         */
        getCategoryDisplayName: function (category) {
            return category ? category.name : '';
        },
        /**
         * 获取按钮文本
         */
        getConfirmButtonText: function () {
            return this.data.mode === 'manage' ? '添加物品' : '记录掉落';
        },
        /**
         * 获取标题文本
         */
        getTitleText: function () {
            return this.data.mode === 'manage' ? '添加物品' : '记录掉落';
        }
    }
});
