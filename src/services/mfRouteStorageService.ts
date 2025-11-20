// MF路线存储服务
// 提供MF路线数据的本地存储CRUD操作
// 确保ES5兼容性

import * as SceneFlowUtils from '../models/scene-flow';
import { SceneStorageService } from './sceneStorageService';
import * as StorageUtils from '../utils/storageUtils';

// 存储键值常量
var STORAGE_KEYS = {
  MF_ROUTES: 'd2_farm_logger_mf_routes',
  VERSION: 'd2_farm_logger_version'
};

// 数据版本信息
var CURRENT_VERSION = '1.0.0';

/**
 * MF路线存储服务类
 */
var MFRouteStorageService = {
  // 预留存储工具引用，确保编译包含storageUtils.js
  _storageUtils: StorageUtils,

  /**
   * 初始化MF路线存储
   * @returns {boolean} 初始化是否成功
   */
  initializeRoutes: function () {
    try {
      // 检查是否已有路线数据
      var existingRoutes = this.getAllRoutes();
      if (existingRoutes.length > 0) {
        return true; // 已有数据，无需初始化
      }

      // MF路线存储已准备好，用户可以创建自定义路线
      this.updateDataVersion();
      console.log('MF路线存储初始化成功');
      return true;
    } catch (error) {
      console.error('初始化MF路线存储失败:', error);
      return false;
    }
  },

  /**
   * 获取所有MF路线数据
   * @returns {Object[]} MF路线数组
   */
  getAllRoutes: function () {
    try {
      var userData = wx.getStorageSync(STORAGE_KEYS.MF_ROUTES);
      return userData || [];
    } catch (error) {
      console.error('获取MF路线数据失败:', error);
      return [];
    }
  },

  /**
   * 根据ID获取MF路线
   * @param {string} id - 路线ID
   * @returns {Object|null} 路线对象或null
   */
  getRouteById: function (id) {
    if (!id) {
      return null;
    }

    try {
      var routes = this.getAllRoutes();
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].id === id) {
          return routes[i];
        }
      }
      return null;
    } catch (error) {
      console.error('获取MF路线失败:', error);
      return null;
    }
  },

  /**
   * 创建新MF路线
   * @param {string} name - 路线名称
   * @param {string[]} sceneIds - 场景ID数组（按顺序）
   * @param {string} description - 路线描述（可选）
   * @returns {boolean} 创建是否成功
   */
  createRoute: function (name, sceneIds, description) {
    try {
      // 验证参数
      if (!SceneFlowUtils.validateSceneFlowName(name)) {
        wx.showToast({
          title: '路线名称无效（1-50字符）',
          icon: 'none'
        });
        return false;
      }

      if (!SceneFlowUtils.validateSceneIds(sceneIds)) {
        wx.showToast({
          title: '场景列表无效（1-20个场景）',
          icon: 'none'
        });
        return false;
      }

      if (description !== undefined && !SceneFlowUtils.validateSceneFlowDescription(description)) {
        wx.showToast({
          title: '路线描述过长（最多200字符）',
          icon: 'none'
        });
        return false;
      }

      var trimmedName = name.trim();

      // 检查名称是否重复
      var existingRoutes = this.getAllRoutes();
      var nameExists = existingRoutes.some(function (route) {
        return route.name === trimmedName;
      });

      if (nameExists) {
        wx.showToast({
          title: '路线名称已存在',
          icon: 'none'
        });
        return false;
      }

      // 验证所有场景ID都存在
      var allScenes = SceneStorageService.getAllScenes();
      var allSceneIds = allScenes.map(function (scene) { return scene.id; });
      var invalidSceneIds = sceneIds.filter(function (sceneId) {
        return allSceneIds.indexOf(sceneId) === -1;
      });

      if (invalidSceneIds.length > 0) {
        wx.showToast({
          title: '包含不存在的场景',
          icon: 'none'
        });
        return false;
      }

      // 创建新MF路线对象
      var newRoute = SceneFlowUtils.createSceneFlow({
        id: StorageUtils.generateUniqueId('route'),
        name: trimmedName,
        description: description ? description.trim() : undefined,
        sceneIds: sceneIds,
        isBuiltIn: false,
        usageCount: 0
      });

      // 添加到路线数组
      existingRoutes.push(newRoute);

      // 保存到存储
      var success = this.saveUserRoutes(existingRoutes);
      if (success) {
        this.updateDataVersion();
        wx.showToast({
          title: '路线添加成功',
          icon: 'success'
        });
      }

      return success;
    } catch (error) {
      console.error('创建MF路线失败:', error);
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 更新MF路线
   * @param {string} routeId - 路线ID
   * @param {Object} updates - 要更新的字段
   * @returns {boolean} 更新是否成功
   */
  updateRoute: function (routeId, updates) {
    try {
      var routes = this.getAllRoutes();
      var routeIndex = -1;

      // 查找路线
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].id === routeId) {
          routeIndex = i;
          break;
        }
      }

      if (routeIndex === -1) {
        wx.showToast({
          title: 'MF路线不存在',
          icon: 'none'
        });
        return false;
      }

      var route = routes[routeIndex];

      // 验证更新数据
      if (updates.name !== undefined) {
        if (!SceneFlowUtils.validateSceneFlowName(updates.name)) {
          wx.showToast({
            title: '路线名称无效（1-50字符）',
            icon: 'none'
          });
          return false;
        }

        var trimmedName = updates.name.trim();
        if (trimmedName !== route.name) {
          // 检查名称重复
          var nameExists = routes.some(function (existingRoute) {
            return existingRoute.id !== routeId && existingRoute.name === trimmedName;
          });

          if (nameExists) {
            wx.showToast({
              title: '路线名称已存在',
              icon: 'none'
            });
            return false;
          }

          route.name = trimmedName;
        }
      }

      if (updates.description !== undefined) {
        if (!SceneFlowUtils.validateSceneFlowDescription(updates.description)) {
          wx.showToast({
            title: '路线描述过长（最多200字符）',
            icon: 'none'
          });
          return false;
        }
        route.description = updates.description ? updates.description.trim() : undefined;
      }

      if (updates.sceneIds !== undefined) {
        if (!SceneFlowUtils.validateSceneIds(updates.sceneIds)) {
          wx.showToast({
            title: '场景列表无效（1-20个场景）',
            icon: 'none'
          });
          return false;
        }

        // 验证所有场景ID都存在
        var allScenes = SceneStorageService.getAllScenes();
        var allSceneIds = allScenes.map(function (scene) { return scene.id; });
        var invalidSceneIds = updates.sceneIds.filter(function (sceneId) {
          return allSceneIds.indexOf(sceneId) === -1;
        });

        if (invalidSceneIds.length > 0) {
          wx.showToast({
            title: '包含不存在的场景',
            icon: 'none'
          });
          return false;
        }

        route.sceneIds = updates.sceneIds;
      }

      // 更新时间戳
      route.updateTime = Date.now();

      // 保存更新
      var success = this.saveUserRoutes(routes);
      if (success) {
        this.updateDataVersion();
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      }

      return success;
    } catch (error) {
      console.error('更新MF路线失败:', error);
      wx.showToast({
        title: '更新失败，请重试',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 删除MF路线
   * @param {string} routeId - 路线ID
   * @returns {boolean} 删除是否成功
   */
  deleteRoute: function (routeId) {
    try {
      var routes = this.getAllRoutes();
      var originalLength = routes.length;

      // 过滤掉要删除的路线
      var filteredRoutes = routes.filter(function (route) {
        return route.id !== routeId;
      });

      if (filteredRoutes.length === originalLength) {
        wx.showToast({
          title: 'MF路线不存在',
          icon: 'none'
        });
        return false;
      }

      // 保存更新
      var success = this.saveUserRoutes(filteredRoutes);
      if (success) {
        this.updateDataVersion();
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }

      return success;
    } catch (error) {
      console.error('删除MF路线失败:', error);
      wx.showToast({
        title: '删除失败，请重试',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 增加路线使用次数
   * @param {string} routeId - 路线ID
   * @returns {boolean} 更新是否成功
   */
  incrementRouteUsage: function (routeId) {
    try {
      var routes = this.getAllRoutes();
      var found = false;

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].id === routeId) {
          routes[i].usageCount++;
          routes[i].updateTime = Date.now();
          routes[i].lastUsedTime = Date.now();
          found = true;
          break;
        }
      }

      if (found) {
        this.saveUserRoutes(routes);
        this.updateDataVersion();
      }

      return found;
    } catch (error) {
      console.error('更新路线使用次数失败:', error);
      return false;
    }
  },

  /**
   * 重新排序路线中的场景
   * @param {string} routeId - 路线ID
   * @param {number} fromIndex - 源位置索引
   * @param {number} toIndex - 目标位置索引
   * @returns {boolean} 排序是否成功
   */
  reorderRouteScenes: function (routeId, fromIndex, toIndex) {
    try {
      var route = this.getRouteById(routeId);
      if (!route) {
        wx.showToast({
          title: 'MF路线不存在',
          icon: 'none'
        });
        return false;
      }

      var newSceneIds = SceneFlowUtils.reorderSceneIds(route.sceneIds, fromIndex, toIndex);

      if (newSceneIds.length === route.sceneIds.length) {
        return this.updateRoute(routeId, { sceneIds: newSceneIds });
      }

      return false;
    } catch (error) {
      console.error('重新排序场景失败:', error);
      wx.showToast({
        title: '排序失败，请重试',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 获取路线统计信息
   * @returns {Object} 统计信息对象
   */
  getRouteStatistics: function () {
    try {
      var routes = this.getAllRoutes();
      var totalCount = routes.length;
      var totalUsage = 0;
      var customCount = 0;

      for (var i = 0; i < routes.length; i++) {
        totalUsage += routes[i].usageCount;
        if (!routes[i].isBuiltIn) {
          customCount++;
        }
      }

      return {
        totalCount: totalCount,
        customCount: customCount,
        builtInCount: totalCount - customCount,
        totalUsage: totalUsage
      };
    } catch (error) {
      console.error('获取路线统计信息失败:', error);
      return {
        totalCount: 0,
        customCount: 0,
        builtInCount: 0,
        totalUsage: 0
      };
    }
  },

  /**
   * 保存用户路线到存储
   * @param {Object[]} routes - 路线数组
   * @returns {boolean} 保存是否成功
   */
  saveUserRoutes: function (routes) {
    try {
      wx.setStorageSync(STORAGE_KEYS.MF_ROUTES, routes);
      return true;
    } catch (error) {
      console.error('保存用户MF路线失败:', error);
      wx.showToast({
        title: '保存失败，存储空间可能不足',
        icon: 'none'
      });
      return false;
    }
  },

  // ==================== 工具方法 ====================

  /**
   * 更新数据版本
   */
  updateDataVersion: function () {
    try {
      var versionData = {
        version: CURRENT_VERSION,
        lastUpdated: Date.now()
      };
      wx.setStorageSync(STORAGE_KEYS.VERSION, versionData);
    } catch (error) {
      console.error('更新数据版本失败:', error);
    }
  },

  /**
   * 检查存储空间
   * @returns {boolean} 是否有足够存储空间
   */
  checkStorageSpace: function () {
    return StorageUtils.checkStorageSpace(1024); // 检查1KB空间
  },

  /**
   * 清空所有MF路线数据
   * @returns {boolean} 是否清空成功
   */
  clearAllRoutes: function () {
    try {
      wx.removeStorageSync(STORAGE_KEYS.MF_ROUTES);
      this.updateDataVersion();
      return true;
    } catch (error) {
      console.error('清空MF路线数据失败:', error);
      return false;
    }
  }
};

export { MFRouteStorageService, STORAGE_KEYS };