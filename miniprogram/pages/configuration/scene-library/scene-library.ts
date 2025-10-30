import { Scene } from '../../../models/scene'

interface SceneLibraryData {
  scenes: Scene[]
  categories: Array<{ key: string; name: string; count: number }>
  currentCategory: string
  filteredScenes: Scene[]
}

// Mock场景数据
const mockScenes: Scene[] = [
  // 内置场景
  {
    id: 'countess',
    name: '女伯爵',
    description: '遗忘之塔第5层，刷符文和钥匙',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'andariel',
    name: '安达利尔',
    description: '洞穴第4层，早期刷装备',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'summoner',
    name: '召唤者',
    description: '召唤者圣堂，刷符文和装备',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'nilathak',
    name: '尼拉塞克',
    description: '神殿之王神殿，刷精华和钥匙',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'mephisto',
    name: '墨菲斯托',
    description: '憎恨的囚牢第3层，KM首选',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'diablo',
    name: '迪亚波罗',
    description: '混沌避难所，刷暗金和套装',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'baal',
    name: '巴尔',
    description: '世界之石要塞第2层，终极Boss',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'pindleskin',
    name: 'P叔',
    description: '尼拉塞克附近的超级小怪',
    isBuiltIn: true,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  // 自定义场景
  {
    id: 'baal-minions',
    name: '巴尔前小怪',
    description: '巴尔召唤的5波小怪群',
    isBuiltIn: false,
    createTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 10 * 24 * 60 * 60 * 1000
  },
  {
    id: 'cows',
    name: '奶牛场',
    description: '秘密奶牛关卡，刷装备和符文',
    isBuiltIn: false,
    createTime: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'pits',
    name: '地穴',
    description: '泰摩高地地穴，85场景',
    isBuiltIn: false,
    createTime: Date.now() - 18 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 8 * 24 * 60 * 60 * 1000
  }
]

Page({
  data: {
    scenes: [],
    categories: [],
    currentCategory: 'all',
    filteredScenes: []
  } as SceneLibraryData,

  onLoad() {
    this.loadScenes()
  },

  /**
   * 加载场景数据
   */
  loadScenes() {
    // 添加分类和时间格式化
    const processedScenes = mockScenes.map(scene => {
      return {
        ...scene,
        categoryText: this.getCategoryText(scene),
        createTimeText: this.formatTime(scene.createTime)
      }
    })

    // 计算分类数量
    const categories = this.calculateCategories(processedScenes)

    // 设置当前分类的场景
    const filteredScenes = this.filterScenesByCategory(processedScenes, this.data.currentCategory)

    this.setData({
      scenes: processedScenes,
      categories: categories,
      filteredScenes: filteredScenes
    })
  },

  /**
   * 获取分类文本
   */
  getCategoryText(scene: Scene): string {
    if (scene.isBuiltIn) {
      return '内置场景'
    } else {
      return '自定义场景'
    }
  },

  /**
   * 计算分类数量
   */
  calculateCategories(scenes: Scene[]) {
    const categories = [
      { key: 'all', name: '全部', count: scenes.length },
      { key: 'builtin', name: '内置', count: scenes.filter(s => s.isBuiltIn).length },
      { key: 'custom', name: '自定义', count: scenes.filter(s => !s.isBuiltIn).length }
    ]
    return categories
  },

  /**
   * 根据分类过滤场景
   */
  filterScenesByCategory(scenes: Scene[], category: string): Scene[] {
    if (category === 'all') {
      return scenes
    } else if (category === 'builtin') {
      return scenes.filter(scene => scene.isBuiltIn)
    } else if (category === 'custom') {
      return scenes.filter(scene => !scene.isBuiltIn)
    }
    return scenes
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
    } else if (days < 30) {
      const weeks = Math.floor(days / 7)
      return weeks + '周前'
    } else {
      const date = new Date(timestamp)
      return (date.getMonth() + 1) + '月' + date.getDate() + '日'
    }
  },

  /**
   * 切换分类
   */
  switchCategory(e: any) {
    const category = e.currentTarget.dataset.category
    const filteredScenes = this.filterScenesByCategory(this.data.scenes, category)

    this.setData({
      currentCategory: category,
      filteredScenes: filteredScenes
    })
  },

  /**
   * 编辑场景
   */
  editScene(e: any) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: `编辑场景: ${item.name}`,
      icon: 'none'
    })
  },

  /**
   * 删除场景
   */
  deleteScene(e: any) {
    const item = e.currentTarget.dataset.item
    const index = this.data.scenes.findIndex(scene => scene.id === item.id)

    if (item.isBuiltIn) {
      wx.showToast({
        title: '内置场景不能删除',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除场景"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const scenes = this.data.scenes
          scenes.splice(index, 1)

          // 重新计算分类和过滤
          const categories = this.calculateCategories(scenes)
          const filteredScenes = this.filterScenesByCategory(scenes, this.data.currentCategory)

          this.setData({
            scenes: scenes,
            categories: categories,
            filteredScenes: filteredScenes
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
   * 添加新场景
   */
  addScene() {
    wx.showToast({
      title: '添加场景功能开发中',
      icon: 'none'
    })
  },

  
  onShow() {
    this.loadScenes()
  }
})