// 物品存储服务
// 提供物品数据的本地存储CRUD操作
// 确保ES5兼容性

import { ItemLibrary, ItemCategory, BUILT_IN_ITEMS, ITEM_CATEGORIES } from '../models/item-library'
import { extendObject } from '../models/character'
var StorageUtils = require('../utils/storageUtils')

// 存储键值常量
var STORAGE_KEYS = {
  ITEMS: 'd2_farm_logger_items',
  VERSION: 'd2_farm_logger_version'
}

// 数据版本信息
var CURRENT_VERSION = '1.0.0'

/**
 * 物品存储服务类
 */
var ItemStorageService = {
  // 预留存储工具引用，确保编译包含storageUtils.js
  _storageUtils: StorageUtils,

  /**
   * 获取所有物品数据（内置物品 + 用户自建物品）
   * @returns {ItemLibrary[]} 物品数组
   */
  getAllItems: function () {
    try {
      // 获取用户自建物品
      var userData = wx.getStorageSync(STORAGE_KEYS.ITEMS)
      var userItems = userData || []

      // 合并内置物品和用户物品
      var allItems = BUILT_IN_ITEMS.concat(userItems)

      return allItems
    } catch (error) {
      console.error('获取物品数据失败:', error)
      return BUILT_IN_ITEMS // 如果获取失败，至少返回内置物品
    }
  },

  /**
   * 创建新物品
   * @param {string} name - 物品名称
   * @param {ItemCategory} category - 物品分类
   * @returns {boolean} 创建是否成功
   */
  createItem: function (name: string, category: ItemCategory) {
    try {
      // 验证参数
      if (!name || !name.trim()) {
        wx.showToast({
          title: '物品名称不能为空',
          icon: 'none'
        })
        return false
      }

      var trimmedName = name.trim()

      // 检查分类是否支持用户添加
      var userCategories = ITEM_CATEGORIES.slice(0, 5) // 只支持前5个分类：暗金、套装、稀有、魔法、底材
      var isUserCategory = userCategories.some(function (cat) {
        return cat.key === category.key
      })

      if (!isUserCategory) {
        wx.showToast({
          title: '该分类不支持添加物品',
          icon: 'none'
        })
        return false
      }

      // 获取现有用户物品，检查名称重复
      var existingItems = this.getUserItems()
      var nameExists = existingItems.some(function (item) {
        return item.category.key === category.key && item.name === trimmedName
      })

      if (nameExists) {
        wx.showToast({
          title: '该分类下已存在相同名称的物品',
          icon: 'none'
        })
        return false
      }

      // 创建新物品对象
      var newItem: ItemLibrary = {
        id: StorageUtils.generateUniqueId(),
        name: trimmedName,
        category: category,
        isBuiltIn: false,
        usageCount: 0,
        createTime: Date.now(),
        updateTime: Date.now()
      }

      // 添加到用户物品数组
      existingItems.push(newItem)

      // 保存到存储
      var success = this.saveUserItems(existingItems)
      if (success) {
        this.updateDataVersion()
        wx.showToast({
          title: '物品添加成功',
          icon: 'success'
        })
      }

      return success
    } catch (error) {
      console.error('创建物品失败:', error)
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 更新物品
   * @param {string} itemId - 物品ID
   * @param {Object} updates - 要更新的字段
   * @returns {boolean} 更新是否成功
   */
  updateItem: function (itemId: string, updates: { name?: string }) {
    try {
      var userItems = this.getUserItems()
      var itemIndex = -1

      // 查找物品
      for (var i = 0; i < userItems.length; i++) {
        if (userItems[i].id === itemId) {
          itemIndex = i
          break
        }
      }

      if (itemIndex === -1) {
        wx.showToast({
          title: '物品不存在',
          icon: 'none'
        })
        return false
      }

      var item = userItems[itemIndex]

      // 如果更新名称，检查重复
      if (updates.name && updates.name.trim() !== item.name) {
        var trimmedName = updates.name.trim()

        // 检查名称重复
        var nameExists = userItems.some(function (existingItem) {
          return existingItem.id !== itemId &&
                 existingItem.category.key === item.category.key &&
                 existingItem.name === trimmedName
        })

        if (nameExists) {
          wx.showToast({
            title: '该分类下已存在相同名称的物品',
            icon: 'none'
          })
          return false
        }

        item.name = trimmedName
      }

      // 更新时间戳
      item.updateTime = Date.now()

      // 保存更新
      var success = this.saveUserItems(userItems)
      if (success) {
        this.updateDataVersion()
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      }

      return success
    } catch (error) {
      console.error('更新物品失败:', error)
      wx.showToast({
        title: '更新失败，请重试',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 删除物品
   * @param {string} itemId - 物品ID
   * @returns {boolean} 删除是否成功
   */
  deleteItem: function (itemId: string) {
    try {
      var userItems = this.getUserItems()
      var originalLength = userItems.length

      // 过滤掉要删除的物品
      var filteredItems = userItems.filter(function (item) {
        return item.id !== itemId
      })

      if (filteredItems.length === originalLength) {
        wx.showToast({
          title: '物品不存在',
          icon: 'none'
        })
        return false
      }

      // 保存更新
      var success = this.saveUserItems(filteredItems)
      if (success) {
        this.updateDataVersion()
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }

      return success
    } catch (error) {
      console.error('删除物品失败:', error)
      wx.showToast({
        title: '删除失败，请重试',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 获取用户自建物品
   * @returns {ItemLibrary[]} 用户物品数组
   */
  getUserItems: function (): ItemLibrary[] {
    try {
      var userData = wx.getStorageSync(STORAGE_KEYS.ITEMS)
      return userData || []
    } catch (error) {
      console.error('获取用户物品失败:', error)
      return []
    }
  },

  /**
   * 保存用户物品到存储
   * @param {ItemLibrary[]} items - 物品数组
   * @returns {boolean} 保存是否成功
   */
  saveUserItems: function (items: ItemLibrary[]): boolean {
    try {
      wx.setStorageSync(STORAGE_KEYS.ITEMS, items)
      return true
    } catch (error) {
      console.error('保存用户物品失败:', error)
      wx.showToast({
        title: '保存失败，存储空间可能不足',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 增加物品使用次数
   * @param {string} itemId - 物品ID
   * @returns {boolean} 更新是否成功
   */
  incrementUsageCount: function (itemId: string): boolean {
    try {
      var allItems = this.getAllItems()
      var itemFound = false

      // 在内置物品中查找
      for (var i = 0; i < BUILT_IN_ITEMS.length; i++) {
        if (BUILT_IN_ITEMS[i].id === itemId) {
          BUILT_IN_ITEMS[i].usageCount++
          BUILT_IN_ITEMS[i].updateTime = Date.now()
          itemFound = true
          break
        }
      }

      // 如果在内置物品中没找到，在用户物品中查找
      if (!itemFound) {
        var userItems = this.getUserItems()
        for (var j = 0; j < userItems.length; j++) {
          if (userItems[j].id === itemId) {
            userItems[j].usageCount++
            userItems[j].updateTime = Date.now()
            this.saveUserItems(userItems)
            itemFound = true
            break
          }
        }
      }

      if (itemFound) {
        this.updateDataVersion()
      }

      return itemFound
    } catch (error) {
      console.error('更新使用次数失败:', error)
      return false
    }
  },

  /**
   * 更新数据版本
   */
  updateDataVersion: function () {
    try {
      var versionData = {
        version: CURRENT_VERSION,
        lastUpdated: Date.now()
      }
      wx.setStorageSync(STORAGE_KEYS.VERSION, versionData)
    } catch (error) {
      console.error('更新数据版本失败:', error)
    }
  },

  /**
   * 检查存储空间
   * @returns {boolean} 是否有足够存储空间
   */
  checkStorageSpace: function (): boolean {
    return StorageUtils.checkStorageSpace()
  },

  /**
   * 获取用户可选择的分类（排除内置分类）
   * @returns {ItemCategory[]} 用户可选分类
   */
  getUserCategories: function (): ItemCategory[] {
    // 只支持前5个分类：暗金、套装、稀有、魔法、底材
    return ITEM_CATEGORIES.slice(0, 5)
  }
}

export { ItemStorageService, STORAGE_KEYS }