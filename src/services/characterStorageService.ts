// 角色存储服务
// 提供角色数据的本地存储CRUD操作
// 确保ES5兼容性

import { Character, CharacterClass } from '../models/character'
import { Scene } from '../models/scene'
var StorageUtils = require('../utils/storageUtils')

// 存储键值常量
var STORAGE_KEYS = {
  CHARACTERS: 'd2_farm_logger_characters',
  VERSION: 'd2_farm_logger_version'
}

// 数据版本信息
var CURRENT_VERSION = '1.0.0'

/**
 * 角色存储服务类
 */
var CharacterStorageService = {
  // 预留场景类型引用，确保编译包含scene.js
  _sceneType: null as Scene | null,

  // 预留存储工具引用，确保编译包含storageUtils.js
  _storageUtils: StorageUtils,

  /**
   * 获取所有角色数据
   * @returns {Character[]} 角色数组
   */
  getAllCharacters: function() {
    try {
      var data = wx.getStorageSync(STORAGE_KEYS.CHARACTERS)
      return data || []
    } catch (error) {
      console.error('获取角色数据失败:', error)
      return []
    }
  },

  /**
   * 根据ID获取角色
   * @param {string} id - 角色ID
   * @returns {Character|null} 角色对象或null
   */
  getCharacterById: function(id) {
    if (!id) {
      return null
    }

    try {
      var characters = this.getAllCharacters()
      for (var i = 0; i < characters.length; i++) {
        if (characters[i].id === id) {
          return characters[i]
        }
      }
      return null
    } catch (error) {
      console.error('获取角色失败:', error)
      return null
    }
  },

  /**
   * 创建新角色
   * @param {Character} character - 角色数据
   * @returns {boolean} 是否创建成功
   */
  createCharacter: function(character) {
    if (!this.validateCharacter(character)) {
      console.error('角色数据验证失败')
      return false
    }

    try {
      var characters = this.getAllCharacters()

      // 检查名称是否重复
      for (var i = 0; i < characters.length; i++) {
        if (characters[i].name === character.name) {
          wx.showToast({
            title: '角色名称已存在',
            icon: 'none'
          })
          return false
        }
      }

      // 添加时间戳
      var now = Date.now()
      character.createTime = now
      character.updateTime = now
      character.lastUsedTime = now

      characters.push(character)

      try {
        wx.setStorageSync(STORAGE_KEYS.CHARACTERS, characters)
        this.updateDataVersion()
        return true
      } catch (error) {
        return false
      }
    } catch (error) {
      console.error('创建角色失败:', error)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 更新角色信息
   * @param {Character} character - 角色数据
   * @returns {boolean} 是否更新成功
   */
  updateCharacter: function(character) {
    if (!character || !character.id) {
      console.error('角色数据无效')
      return false
    }

    if (!this.validateCharacter(character)) {
      console.error('角色数据验证失败')
      return false
    }

    try {
      var characters = this.getAllCharacters()
      var found = false

      for (var i = 0; i < characters.length; i++) {
        if (characters[i].id === character.id) {
          // 检查名称是否与其他角色重复
          for (var j = 0; j < characters.length; j++) {
            if (j !== i && characters[j].name === character.name) {
              wx.showToast({
                title: '角色名称已存在',
                icon: 'none'
              })
              return false
            }
          }

          // 更新角色信息
          characters[i] = character
          characters[i].updateTime = Date.now()
          characters[i].lastUsedTime = Date.now()
          found = true
          break
        }
      }

      if (!found) {
        console.error('角色不存在')
        return false
      }

      try {
        wx.setStorageSync(STORAGE_KEYS.CHARACTERS, characters)
        this.updateDataVersion()
        return true
      } catch (error) {
        return false
      }
    } catch (error) {
      console.error('更新角色失败:', error)
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 删除角色
   * @param {string} id - 角色ID
   * @returns {boolean} 是否删除成功
   */
  deleteCharacter: function(id) {
    if (!id) {
      console.error('角色ID无效')
      return false
    }

    try {
      var characters = this.getAllCharacters()
      var newCharacters = []
      var found = false

      for (var i = 0; i < characters.length; i++) {
        if (characters[i].id !== id) {
          newCharacters.push(characters[i])
        } else {
          found = true
        }
      }

      if (!found) {
        console.error('角色不存在')
        return false
      }

      try {
        wx.setStorageSync(STORAGE_KEYS.CHARACTERS, newCharacters)
        this.updateDataVersion()
        return true
      } catch (error) {
        return false
      }
    } catch (error) {
      console.error('删除角色失败:', error)
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 验证角色数据
   * @param {any} character - 待验证的角色数据
   * @returns {boolean} 是否有效
   */
  validateCharacter: function(character) {
    if (!character) {
      return false
    }

    // 必填字段检查
    if (!character.id || !character.name || !character.class) {
      return false
    }

    // 名称验证
    if (typeof character.name !== 'string' || character.name.length < 1 || character.name.length > 20) {
      return false
    }

    // 职业验证
    var validClasses = [
      CharacterClass.Sorceress,
      CharacterClass.Paladin,
      CharacterClass.Necromancer,
      CharacterClass.Amazon,
      CharacterClass.Barbarian,
      CharacterClass.Druid,
      CharacterClass.Assassin
    ]

    var classValid = false
    for (var i = 0; i < validClasses.length; i++) {
      if (character.class === validClasses[i]) {
        classValid = true
        break
      }
    }

    if (!classValid) {
      return false
    }

    // 等级验证
    if (character.level !== undefined && character.level !== null) {
      if (typeof character.level !== 'number' || character.level < 1 || character.level > 99 || character.level !== Math.floor(character.level)) {
        return false
      }
    }

    // MF值验证
    if (character.magicFind !== undefined && character.magicFind !== null) {
      if (typeof character.magicFind !== 'number' || character.magicFind < 0 || character.magicFind > 9999 || character.magicFind !== Math.floor(character.magicFind)) {
        return false
      }
    }

    // 默认场景ID验证
    if (character.defaultSceneIds) {
      if (!Array.isArray(character.defaultSceneIds)) {
        return false
      }
    }

    return true
  },

  /**
   * 生成角色ID
   * @returns {string} 新的角色ID
   */
  generateCharacterId: function() {
    var timestamp = Date.now()
    var random = Math.floor(Math.random() * 1000)
    return timestamp + '_' + (random < 10 ? '00' + random : random < 100 ? '0' + random : random)
  },

  /**
   * 更新数据版本
   */
  updateDataVersion: function() {
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
   * 获取存储大小
   * @returns {number} 存储大小（字节）
   */
  getStorageSize: function() {
    try {
      var data = wx.getStorageInfoSync()
      return data.currentSize
    } catch (error) {
      console.error('获取存储大小失败:', error)
      return 0
    }
  },

  /**
   * 清空所有角色数据
   * @returns {boolean} 是否清空成功
   */
  clearAllCharacters: function() {
    try {
      wx.removeStorageSync(STORAGE_KEYS.CHARACTERS)
      this.updateDataVersion()
      return true
    } catch (error) {
      console.error('清空角色数据失败:', error)
      return false
    }
  }
}

module.exports = {
  CharacterStorageService: CharacterStorageService
}