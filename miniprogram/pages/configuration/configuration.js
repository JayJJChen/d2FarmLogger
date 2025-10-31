"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sceneStorageService_1 = require("../../services/sceneStorageService");
var itemStorageService_1 = require("../../services/itemStorageService");
Page({
    data: {
        sceneFlowsCount: 0,
        scenesCount: 0,
        itemsCount: 0
    },
    onLoad: function () {
        this.loadConfigurationData();
    },
    /**
     * 加载配置数据统计
     */
    loadConfigurationData: function () {
        // 初始化默认场景（如果需要）
        sceneStorageService_1.SceneStorageService.initializeDefaultScenes();
        // 获取真实的场景和场景流程数量
        var allScenes = sceneStorageService_1.SceneStorageService.getAllScenes();
        var allSceneFlows = sceneStorageService_1.SceneStorageService.getAllSceneFlows();
        var allItems = itemStorageService_1.ItemStorageService.getAllItems();
        this.setData({
            sceneFlowsCount: allSceneFlows.length,
            scenesCount: allScenes.length,
            itemsCount: allItems.length
        });
    },
    /**
     * 导航到场景流程管理
     */
    navigateToSceneFlows: function () {
        wx.navigateTo({
            url: '/pages/configuration/scene-flows/scene-flows'
        });
    },
    /**
     * 导航到场景库管理
     */
    navigateToSceneLibrary: function () {
        wx.navigateTo({
            url: '/pages/configuration/scene-library/scene-library'
        });
    },
    /**
     * 导航到物品库管理
     */
    navigateToItemLibrary: function () {
        wx.navigateTo({
            url: '/pages/configuration/item-library/item-library'
        });
    },
    onShow: function () {
        // 每次显示页面时刷新数据统计
        this.loadConfigurationData();
    }
});
