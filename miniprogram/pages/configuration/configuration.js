"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sceneStorageService_1 = require("../../services/sceneStorageService");
var ItemStorageService = require('../../services/itemStorageService').ItemStorageService;
var MFRouteStorageService = require('../../services/mfRouteStorageService').MFRouteStorageService;
Page({
    data: {
        mfRoutesCount: 0,
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
        sceneStorageService_1.SceneStorageService.initializeScenes();
        MFRouteStorageService.initializeRoutes();
        // 获取真实的场景、MF路线和物品数量
        var allScenes = sceneStorageService_1.SceneStorageService.getAllScenes();
        var allMFRoutes = MFRouteStorageService.getAllRoutes();
        var allItems = ItemStorageService.getAllItems();
        this.setData({
            mfRoutesCount: allMFRoutes.length,
            scenesCount: allScenes.length,
            itemsCount: allItems.length
        });
    },
    /**
     * 导航到MF路线管理
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
