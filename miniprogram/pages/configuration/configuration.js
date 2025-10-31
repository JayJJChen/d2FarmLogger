var SceneStorageService = require('../services/sceneStorageService');
var ItemStorageService = require('../services/itemStorageService');

Page({
    data: {
        sceneFlowsCount: 0,
        scenesCount: 0,
        itemsCount: 0
    },
    onLoad() {
        this.loadConfigurationData();
    },
    /**
     * 加载配置数据统计
     */
    loadConfigurationData() {
        // 初始化默认场景（如果需要）
        SceneStorageService.SceneStorageService.initializeDefaultScenes();

        // 获取真实的场景和场景流程数量
        var allScenes = SceneStorageService.SceneStorageService.getAllScenes();
        var allSceneFlows = SceneStorageService.SceneStorageService.getAllSceneFlows();
        var allItems = ItemStorageService.ItemStorageService.getAllItems();

        this.setData({
            sceneFlowsCount: allSceneFlows.length,
            scenesCount: allScenes.length,
            itemsCount: allItems.length
        });
    },
    /**
     * 导航到场景流程管理
     */
    navigateToSceneFlows() {
        wx.navigateTo({
            url: '/pages/configuration/scene-flows/scene-flows'
        });
    },
    /**
     * 导航到场景库管理
     */
    navigateToSceneLibrary() {
        wx.navigateTo({
            url: '/pages/configuration/scene-library/scene-library'
        });
    },
    /**
     * 导航到物品库管理
     */
    navigateToItemLibrary() {
        wx.navigateTo({
            url: '/pages/configuration/item-library/item-library'
        });
    },
    onShow() {
        // 每次显示页面时刷新数据统计
        this.loadConfigurationData();
    }
});
