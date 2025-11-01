import { SceneFlow } from '../../../models/scene-flow'

interface SceneFlowsData {
  sceneFlows: SceneFlow[]
}

// Mock场景数据
const mockScenes: { [key: string]: string } = {
  'countess': '女伯爵',
  'andariel': '安达利尔',
  'summoner': '召唤者',
  'nilathak': '尼拉塞克',
  'mephisto': '墨菲斯托',
  'diablo': '迪亚波罗',
  'baal': '巴尔',
  'pindleskin': 'P叔'
}

Page({
  data: {
    sceneFlows: []
  } as SceneFlowsData,

  onLoad() {
    this.loadSceneFlows()
  },

  /**
   * 加载场景流程数据
   */
  loadSceneFlows() {
    // Mock数据
    const mockSceneFlows: SceneFlow[] = [
      {
        id: '1',
        name: 'Key Run',
        sceneIds: ['countess', 'summoner', 'nilathak'],
        sceneCount: 3,
        isBuiltIn: true,
        usageCount: 0,
        createTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        updateTime: Date.now() - 2 * 24 * 60 * 60 * 1000
      },
      {
        id: '2',
        name: 'KM (仅墨菲斯托)',
        sceneIds: ['mephisto'],
        sceneCount: 1,
        isBuiltIn: true,
        usageCount: 0,
        createTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        updateTime: Date.now() - 3 * 24 * 60 * 60 * 1000
      },
      {
        id: '3',
        name: '85场景全刷',
        sceneIds: ['countess', 'andariel', 'summoner', 'nilathak', 'mephisto', 'diablo', 'baal'],
        sceneCount: 7,
        isBuiltIn: false,
        usageCount: 0,
        createTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
        updateTime: Date.now() - 1 * 24 * 60 * 60 * 1000
      }
    ]

    // 添加场景预览和时间格式化
    const processedSceneFlows = mockSceneFlows.map(flow => {
      let scenesPreview = ''
      if (flow.id === '1') {
        scenesPreview = '女伯爵 → 召唤者 → 尼拉塞克'
      } else if (flow.id === '2') {
        scenesPreview = '墨菲斯托'
      } else if (flow.id === '3') {
        scenesPreview = '女伯爵 → 安达利尔 → 召唤者 → 尼拉塞克 → 墨菲斯托 → 迪亚波罗 → 巴尔'
      }

      return {
        ...flow,
        scenesPreview: scenesPreview,
        updateTimeText: this.formatTime(flow.updateTime)
      }
    })

    this.setData({
      sceneFlows: processedSceneFlows
    })
  },

  /**
   * 格式化时间
   */
  formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))

    if (days === 0) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      if (hours === 0) {
        const minutes = Math.floor(diff / (60 * 1000))
        return minutes === 0 ? '刚刚' : minutes + '分钟前'
      }
      return hours + '小时前'
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return days + '天前'
    } else {
      const date = new Date(timestamp)
      return (date.getMonth() + 1) + '月' + date.getDate() + '日'
    }
  },

  /**
   * 查看场景流程详情
   */
  viewSceneFlow(e: any) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: `查看流程: ${item.name}`,
      icon: 'none'
    })
  },

  /**
   * 编辑场景流程
   */
  editSceneFlow(e: any) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: `编辑流程: ${item.name}`,
      icon: 'none'
    })
  },

  /**
   * 删除场景流程
   */
  deleteSceneFlow(e: any) {
    const item = e.currentTarget.dataset.item
    // 使用ES5兼容的方式查找索引
    var index = -1
    for (var i = 0; i < this.data.sceneFlows.length; i++) {
      if (this.data.sceneFlows[i].id === item.id) {
        index = i
        break
      }
    }

    if (item.isBuiltIn) {
      wx.showToast({
        title: '内置流程不能删除',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除流程"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const sceneFlows = this.data.sceneFlows
          sceneFlows.splice(index, 1)
          this.setData({
            sceneFlows: sceneFlows
          })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  /**
   * 添加新场景流程
   */
  addSceneFlow() {
    wx.showToast({
      title: '新增流程功能开发中',
      icon: 'none'
    })
  },

  
  onShow() {
    this.loadSceneFlows()
  }
})