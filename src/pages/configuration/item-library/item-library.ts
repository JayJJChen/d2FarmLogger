import { ItemLibrary, ItemLibraryItem, ItemCategory, ITEM_CATEGORIES } from '../../../models/item-library'
import { extendObject } from '../../../models/character'
var { ItemStorageService } = require('../../../services/itemStorageService')

interface ItemLibraryData {
  items: ItemLibrary[]
  categories: Array<ItemCategory & { count: number }>
  currentCategory: string
  filteredItems: ItemLibraryItem[]
  searchKeyword: string
  sortOrder: 'usage' | 'time'
  totalItems: number
}

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
    // 从存储服务获取所有物品数据
    const allItems = ItemStorageService.getAllItems()

    // 添加时间格式化
    const processedItems = allItems.map(item => {
      const result = extendObject({}, item)
      result.createTimeText = this.formatTime(item.createTime)
      return result
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
      const result = extendObject({}, category)
      result.count = items.filter(function(item) { return item.category.key === category.key }).length
      return result
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

    return filtered.map(function(item) {
      var result = extendObject({}, item)
      result.createTimeText = this.formatTime(item.createTime)
      return result
    }.bind(this)) as ItemLibraryItem[]
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
   * 编辑物品
   */
  editItem(e: any) {
    const item = e.currentTarget.dataset.item

    if (item.isBuiltIn) {
      wx.showToast({
        title: '内置物品不能编辑',
        icon: 'none'
      })
      return
    }

    // 显示编辑对话框
    wx.showModal({
      title: '编辑物品',
      editable: true,
      placeholderText: '请输入物品名称',
      content: item.name,
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          this.updateItemName(item, res.content.trim())
        }
      }
    })
  },

  /**
   * 更新物品名称
   */
  updateItemName(item: ItemLibrary, newName: string) {
    const success = ItemStorageService.updateItem(item.id, { name: newName })

    if (success) {
      // 重新加载数据
      this.loadItems()
    }
  },

  /**
   * 删除物品
   */
  deleteItem(e: any) {
    const item = e.currentTarget.dataset.item

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
          const success = ItemStorageService.deleteItem(item.id)

          if (success) {
            // 重新加载数据
            this.loadItems()
          }
        }
      }
    })
  },

  /**
   * 显示添加物品对话框
   */
  showAddItemDialog() {
    // 使用新的item-form组件
    const itemForm = this.selectComponent('#itemForm')
    if (itemForm) {
      itemForm.show()
    }
  },

  /**
   * 处理物品表单确认事件
   */
  onItemFormConfirm(e: any) {
    const formData = e.detail

    if (formData.mode === 'manage') {
      // 物品管理模式：添加新物品到词库
      const success = ItemStorageService.createItem(formData.name, formData.category)

      if (success) {
        // 重新加载数据
        this.loadItems()
      }
    } else {
      // Session记录模式：处理session记录（预留功能）
      console.log('Session记录模式：', formData)
      // TODO: 实现session记录功能
    }
  },

  onShow() {
    this.loadItems()
  }
})