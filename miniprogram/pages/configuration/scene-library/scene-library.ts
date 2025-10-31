import { Scene } from '../../../models/scene'
import { SceneStorageService } from '../../../services/sceneStorageService'

interface SceneLibraryData {
  scenes: Scene[]
  categories: Array<{ key: string; name: string; count: number }>
  currentCategory: string
  filteredScenes: Scene[]
}

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
    // 初始化默认场景（如果需要）
    SceneStorageService.initializeDefaultScenes()

    // 从存储获取场景数据
    const scenes = SceneStorageService.getAllScenes()

    // 添加分类和时间格式化
    const processedScenes = scenes.map(scene => {
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
    wx.showModal({
      title: '编辑场景',
      content: `编辑场景功能暂未实现`,
      showCancel: false
    })
  },

  /**
   * 删除场景
   */
  deleteScene(e: any) {
    const item = e.currentTarget.dataset.item

    wx.showModal({
      title: '确认删除',
      content: `确定要删除场景"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const success = SceneStorageService.deleteScene(item.id)
          if (success) {
            // 重新加载数据
            this.loadScenes()
          }
        }
      }
    })
  },

  /**
   * 添加新场景
   */
  addScene() {
    wx.showModal({
      title: '添加场景',
      editable: true,
      placeholderText: '请输入场景名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const success = SceneStorageService.createScene(res.content, undefined)
          if (success) {
            // 重新加载数据
            this.loadScenes()
          }
        }
      }
    })
  },

  
  onShow() {
    this.loadScenes()
  }
})