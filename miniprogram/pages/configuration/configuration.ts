interface ConfigurationData {
  sceneFlowsCount: number
  scenesCount: number
  itemsCount: number
}

Page({
  data: {
    sceneFlowsCount: 2,
    scenesCount: 8,
    itemsCount: 15
  } as ConfigurationData,

  onLoad() {
    this.loadConfigurationData()
  },

  /**
   * 加载配置数据统计
   */
  loadConfigurationData() {
    // TODO: 实际从存储服务获取数据
    // 这里使用Mock数据
    this.setData({
      sceneFlowsCount: 2,
      scenesCount: 8,
      itemsCount: 15
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