"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var sceneStorageService_1 = require("../../../services/sceneStorageService");
Page({
    data: {
        scenes: [],
        categories: [],
        currentCategory: 'all',
        filteredScenes: []
    },
    onLoad: function () {
        this.loadScenes();
    },
    /**
     * 加载场景数据
     */
    loadScenes: function () {
        var _this = this;
        // 初始化默认场景（如果需要）
        sceneStorageService_1.SceneStorageService.initializeScenes();
        // 从存储获取场景数据
        var scenes = sceneStorageService_1.SceneStorageService.getAllScenes();
        // 添加分类和时间格式化
        var processedScenes = scenes.map(function (scene) {
            return __assign(__assign({}, scene), { categoryText: _this.getCategoryText(scene), createTimeText: _this.formatTime(scene.createTime) });
        });
        // 计算分类数量
        var categories = this.calculateCategories(processedScenes);
        // 设置当前分类的场景
        var filteredScenes = this.filterScenesByCategory(processedScenes, this.data.currentCategory);
        this.setData({
            scenes: processedScenes,
            categories: categories,
            filteredScenes: filteredScenes
        });
    },
    /**
     * 获取分类文本
     */
    getCategoryText: function (scene) {
        if (scene.isBuiltIn) {
            return '内置场景';
        }
        else {
            return '自定义场景';
        }
    },
    /**
     * 计算分类数量
     */
    calculateCategories: function (scenes) {
        var categories = [
            { key: 'all', name: '全部', count: scenes.length },
            { key: 'builtin', name: '内置', count: scenes.filter(function (s) { return s.isBuiltIn; }).length },
            { key: 'custom', name: '自定义', count: scenes.filter(function (s) { return !s.isBuiltIn; }).length }
        ];
        return categories;
    },
    /**
     * 根据分类过滤场景
     */
    filterScenesByCategory: function (scenes, category) {
        if (category === 'all') {
            return scenes;
        }
        else if (category === 'builtin') {
            return scenes.filter(function (scene) { return scene.isBuiltIn; });
        }
        else if (category === 'custom') {
            return scenes.filter(function (scene) { return !scene.isBuiltIn; });
        }
        return scenes;
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
        var filteredScenes = this.filterScenesByCategory(this.data.scenes, category);
        this.setData({
            currentCategory: category,
            filteredScenes: filteredScenes
        });
    },
    /**
     * 编辑场景
     */
    editScene: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.showModal({
            title: '编辑场景',
            content: "\u7F16\u8F91\u573A\u666F\u529F\u80FD\u6682\u672A\u5B9E\u73B0",
            showCancel: false
        });
    },
    /**
     * 删除场景
     */
    deleteScene: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        wx.showModal({
            title: '确认删除',
            content: "\u786E\u5B9A\u8981\u5220\u9664\u573A\u666F\"".concat(item.name, "\"\u5417\uFF1F"),
            success: function (res) {
                if (res.confirm) {
                    var success = sceneStorageService_1.SceneStorageService.deleteScene(item.id);
                    if (success) {
                        // 重新加载数据
                        _this.loadScenes();
                    }
                }
            }
        });
    },
    /**
     * 添加新场景
     */
    addScene: function () {
        var _this = this;
        wx.showModal({
            title: '添加场景',
            editable: true,
            placeholderText: '请输入场景名称',
            success: function (res) {
                if (res.confirm && res.content) {
                    var success = sceneStorageService_1.SceneStorageService.createScene(res.content, undefined);
                    if (success) {
                        // 重新加载数据
                        _this.loadScenes();
                    }
                }
            }
        });
    },
    onShow: function () {
        this.loadScenes();
    }
});
