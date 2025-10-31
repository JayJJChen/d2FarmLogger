import { SceneStorageService } from '../../services/sceneStorageService'
import { ItemStorageService } from '../../services/itemStorageService'

interface ConfigurationData {
  sceneFlowsCount: number
  scenesCount: number
  itemsCount: number
}

Page({
  data: {
    sceneFlowsCount: 0,
    scenesCount: 0,
    itemsCount: 0
  } as ConfigurationData,

  onLoad() {
    this.loadConfigurationData()
  },

  /**
   * 加载配置数据统计
   */
  loadConfigurationData() {
    // 初始化默认场景（如果需要）
    SceneStorageService.initializeDefaultScenes()

    // 获取真实的场景和场景流程数量
    const allScenes = SceneStorageService.getAllScenes()
    const allSceneFlows = SceneStorageService.getAllSceneFlows()
    const allItems = ItemStorageService.getAllItems()

    this.setData({
      sceneFlowsCount: allSceneFlows.length,
      scenesCount: allScenes.length,
      itemsCount: allItems.length
    })
  },

  /**
   * 导航到场景流程管理
   */
  navigateToSceneFlows() {
    wx.navigateTo({
      url: '/pages/configuration/scene-flows/scene-flows'
    })
  },

  /**
   * 导航到场景库管理
   */
  navigateToSceneLibrary() {
    wx.navigateTo({
      url: '/pages/configuration/scene-library/scene-library'
    })
  },

  /**
   * 导航到物品库管理
   */
  navigateToItemLibrary() {
    wx.navigateTo({
      url: '/pages/configuration/item-library/item-library'
    })
  },

  onShow() {
    // 每次显示页面时刷新数据统计
    this.loadConfigurationData()
  }
})