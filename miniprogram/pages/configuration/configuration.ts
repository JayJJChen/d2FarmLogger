import { ItemStorageService } from '../../services/itemStorageService'

interface ConfigurationData {
  sceneFlowsCount: number
  scenesCount: number
  itemsCount: number
}

Page({
  data: {
    sceneFlowsCount: 2,
    scenesCount: 8,
    itemsCount: 0
  } as ConfigurationData,

  onLoad() {
    this.loadConfigurationData()
  },

  /**
   * 加载配置数据统计
   */
  loadConfigurationData() {
    // 获取真实的物品数量（包括内置物品和用户物品）
    const allItems = ItemStorageService.getAllItems()

    this.setData({
      sceneFlowsCount: 2,  // TODO: 从实际存储服务获取
      scenesCount: 8,     // TODO: 从实际存储服务获取
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