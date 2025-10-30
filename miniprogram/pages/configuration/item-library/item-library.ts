import { ItemLibrary, ItemLibraryItem, ItemCategory, ITEM_CATEGORIES } from '../../../models/item-library'

interface ItemLibraryData {
  items: ItemLibrary[]
  categories: Array<ItemCategory & { count: number }>
  currentCategory: string
  filteredItems: ItemLibraryItem[]
  searchKeyword: string
  sortOrder: 'usage' | 'time'
  totalItems: number
}

// Mock物品数据
const mockItems: ItemLibrary[] = [
  // 暗金物品
  {
    id: 'shako',
    name: '军帽',
    category: ITEM_CATEGORIES[0], // unique
    isBuiltIn: false,
    usageCount: 15,
    createTime: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 'shako_en',
    name: 'Shako',
    category: ITEM_CATEGORIES[0],
    isBuiltIn: false,
    usageCount: 8,
    createTime: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'griffon',
    name: '格里风之眼',
    category: ITEM_CATEGORIES[0],
    isBuiltIn: false,
    usageCount: 6,
    createTime: Date.now() - 18 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id: 'wartraveler',
    name: '战争旅者',
    category: ITEM_CATEGORIES[0],
    isBuiltIn: false,
    usageCount: 12,
    createTime: Date.now() - 22 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  // 套装物品
  {
    id: 'tal_rasha_mask',
    name: '塔拉夏面具',
    category: ITEM_CATEGORIES[1], // set
    isBuiltIn: false,
    usageCount: 4,
    createTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 6 * 24 * 60 * 60 * 1000
  },
  // 符文
  {
    id: 'ber',
    name: 'Ber',
    category: ITEM_CATEGORIES[4], // rune
    isBuiltIn: true,
    usageCount: 25,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 1 * 60 * 60 * 1000
  },
  {
    id: 'jah',
    name: 'Jah',
    category: ITEM_CATEGORIES[4],
    isBuiltIn: true,
    usageCount: 18,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 3 * 60 * 60 * 1000
  },
  {
    id: 'sur',
    name: 'Sur',
    category: ITEM_CATEGORIES[4],
    isBuiltIn: true,
    usageCount: 9,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 12 * 60 * 60 * 1000
  },
  // 钥匙
  {
    id: 'key_hate',
    name: '憎恨之钥',
    category: ITEM_CATEGORIES[6], // key
    isBuiltIn: true,
    usageCount: 32,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 30 * 60 * 1000
  },
  {
    id: 'key_terror',
    name: '恐惧之钥',
    category: ITEM_CATEGORIES[6],
    isBuiltIn: true,
    usageCount: 28,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 45 * 60 * 1000
  },
  {
    id: 'key_destruction',
    name: '毁灭之钥',
    category: ITEM_CATEGORIES[6],
    isBuiltIn: true,
    usageCount: 26,
    createTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 90 * 60 * 1000
  },
  // 底材
  {
    id: 'monarch_4soc',
    name: '君王盾 4凹',
    category: ITEM_CATEGORIES[5], // base
    isBuiltIn: false,
    usageCount: 7,
    createTime: Date.now() - 12 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id: 'phaseblade_5soc',
    name: '幻化之刃 5凹',
    category: ITEM_CATEGORIES[5],
    isBuiltIn: false,
    usageCount: 5,
    createTime: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updateTime: Date.now() - 2 * 24 * 60 * 60 * 1000
  }
]

Page({
  data: {
    items: [],
    categories: [],
    currentCategory: 'unique',
    filteredItems: [],
    searchKeyword: '',
    sortOrder: 'usage',
    totalItems: 0
  } as ItemLibraryData,

  onLoad() {
    this.loadItems()
  },

  /**
   * 加载物品数据
   */
  loadItems() {
    // 添加时间格式化
    const processedItems = mockItems.map(item => {
      return {
        ...item,
        createTimeText: this.formatTime(item.createTime)
      }
    })

    // 计算分类数量
    const categories = this.calculateCategories(processedItems)

    // 设置当前分类的物品
    const filteredItems = this.filterAndSortItems(processedItems, this.data.currentCategory, this.data.searchKeyword, this.data.sortOrder)

    this.setData({
      items: processedItems,
      categories: categories,
      filteredItems: filteredItems,
      totalItems: processedItems.length
    })
  },

  /**
   * 计算分类数量
   */
  calculateCategories(items: ItemLibrary[]) {
    const categories = ITEM_CATEGORIES.map(category => {
      return {
        ...category,
        count: items.filter(item => item.category.key === category.key).length
      }
    })
    return categories
  },

  /**
   * 过滤和排序物品
   */
  filterAndSortItems(items: ItemLibrary[], category: string, keyword: string, sortOrder: 'usage' | 'time'): ItemLibraryItem[] {
    let filtered = items

    // 按分类过滤
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category.key === category)
    }

    // 按关键词搜索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().indexOf(lowerKeyword) !== -1
      )
    }

    // 排序
    filtered.sort((a, b) => {
      if (sortOrder === 'usage') {
        return b.usageCount - a.usageCount
      } else {
        return b.updateTime - a.updateTime
      }
    })

    return filtered.map(item => ({
      ...item,
      createTimeText: this.formatTime(item.createTime)
    })) as ItemLibraryItem[]
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
    const filteredItems = this.filterAndSortItems(this.data.items, category, this.data.searchKeyword, this.data.sortOrder)

    this.setData({
      currentCategory: category,
      filteredItems: filteredItems
    })
  },

  /**
   * 搜索输入
   */
  onSearchInput(e: any) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    })

    // 实时搜索
    const filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, keyword, this.data.sortOrder)
    this.setData({
      filteredItems: filteredItems
    })
  },

  /**
   * 搜索确认
   */
  onSearchConfirm(e: any) {
    const keyword = e.detail.value
    const filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, keyword, this.data.sortOrder)
    this.setData({
      filteredItems: filteredItems
    })
  },

  /**
   * 切换排序方式
   */
  toggleSortOrder() {
    const newSortOrder = this.data.sortOrder === 'usage' ? 'time' : 'usage'
    const filteredItems = this.filterAndSortItems(this.data.items, this.data.currentCategory, this.data.searchKeyword, newSortOrder)

    this.setData({
      sortOrder: newSortOrder,
      filteredItems: filteredItems
    })
  },

  /**
   * 合并物品
   */
  mergeItem(e: any) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: `合并物品: ${item.name}`,
      icon: 'none'
    })
  },

  /**
   * 编辑物品
   */
  editItem(e: any) {
    const item = e.currentTarget.dataset.item
    wx.showToast({
      title: `编辑物品: ${item.name}`,
      icon: 'none'
    })
  },

  /**
   * 删除物品
   */
  deleteItem(e: any) {
    const item = e.currentTarget.dataset.item
    const index = this.data.items.findIndex(i => i.id === item.id)

    if (item.isBuiltIn) {
      wx.showToast({
        title: '内置物品不能删除',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除物品"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const items = this.data.items
          items.splice(index, 1)

          // 重新计算分类和过滤
          const categories = this.calculateCategories(items)
          const filteredItems = this.filterAndSortItems(items, this.data.currentCategory, this.data.searchKeyword, this.data.sortOrder)

          this.setData({
            items: items,
            categories: categories,
            filteredItems: filteredItems,
            totalItems: items.length
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
   * 批量合并对话框
   */
  showMergeAllDialog() {
    wx.showToast({
      title: '批量合并功能开发中',
      icon: 'none'
    })
  },

  
  onShow() {
    this.loadItems()
  }
})