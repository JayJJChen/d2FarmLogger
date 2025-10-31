"use strict";
// 场景存储服务
// 提供场景和场景流程数据的本地存储CRUD操作
// 确保ES5兼容性
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEYS = exports.SceneStorageService = void 0;
var SceneUtils = require('../models/scene');
var SceneFlowUtils = require('../models/scene-flow');
var StorageUtils = require('../utils/storageUtils');
// 存储键值常量
var STORAGE_KEYS = {
    SCENES: 'd2_farm_logger_scenes',
    SCENE_FLOWS: 'd2_farm_logger_scene_flows',
    VERSION: 'd2_farm_logger_version'
};
exports.STORAGE_KEYS = STORAGE_KEYS;
// 数据版本信息
var CURRENT_VERSION = '1.0.0';
/**
 * 场景存储服务类
 */
var SceneStorageService = {
    // 预留存储工具引用，确保编译包含storageUtils.js
    _storageUtils: StorageUtils,
    // ==================== 场景相关方法 ====================
    /**
     * 初始化默认场景（如果存储为空）
     * @returns {boolean} 初始化是否成功
     */
    initializeDefaultScenes: function () {
        try {
            // 检查是否已有场景数据
            var existingScenes = this.getAllScenes();
            if (existingScenes.length > 0) {
                return true; // 已有数据，无需初始化
            }
            // 默认场景数据
            var defaultScenes = [
                {
                    id: 'countess',
                    name: '女伯爵',
                    description: '遗忘之塔第5层，刷符文和钥匙',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'andariel',
                    name: '安达利尔',
                    description: '洞穴第4层，早期刷装备',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'summoner',
                    name: '召唤者',
                    description: '召唤者圣堂，刷符文和装备',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'nilathak',
                    name: '尼拉塞克',
                    description: '神殿之王神殿，刷精华和钥匙',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'mephisto',
                    name: '墨菲斯托',
                    description: '憎恨的囚牢第3层，KM首选',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'diablo',
                    name: '迪亚波罗',
                    description: '混沌避难所，刷暗金和套装',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'baal',
                    name: '巴尔',
                    description: '世界之石要塞第2层，终极Boss',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'pindleskin',
                    name: 'P叔',
                    description: '尼拉塞克附近的超级小怪',
                    isBuiltIn: true,
                    usageCount: 0
                },
                {
                    id: 'baal-minions',
                    name: '巴尔前小怪',
                    description: '巴尔召唤的5波小怪群',
                    isBuiltIn: false,
                    usageCount: 0
                },
                {
                    id: 'cows',
                    name: '奶牛场',
                    description: '秘密奶牛关卡，刷装备和符文',
                    isBuiltIn: false,
                    usageCount: 0
                },
                {
                    id: 'pits',
                    name: '地穴',
                    description: '泰摩高地地穴，85场景',
                    isBuiltIn: false,
                    usageCount: 0
                }
            ];
            // 创建场景对象
            var scenes = defaultScenes.map(function (sceneData) {
                return SceneUtils.createScene(sceneData);
            });
            // 保存到存储
            var success = this.saveUserScenes(scenes);
            if (success) {
                this.updateDataVersion();
                console.log('默认场景初始化成功，共', scenes.length, '个场景');
            }
            return success;
        }
        catch (error) {
            console.error('初始化默认场景失败:', error);
            return false;
        }
    },
    /**
     * 获取所有场景数据
     * @returns {Object[]} 场景数组
     */
    getAllScenes: function () {
        try {
            var userData = wx.getStorageSync(STORAGE_KEYS.SCENES);
            return userData || [];
        }
        catch (error) {
            console.error('获取场景数据失败:', error);
            return [];
        }
    },
    /**
     * 根据ID获取场景
     * @param {string} id - 场景ID
     * @returns {Object|null} 场景对象或null
     */
    getSceneById: function (id) {
        if (!id) {
            return null;
        }
        try {
            var scenes = this.getAllScenes();
            for (var i = 0; i < scenes.length; i++) {
                if (scenes[i].id === id) {
                    return scenes[i];
                }
            }
            return null;
        }
        catch (error) {
            console.error('获取场景失败:', error);
            return null;
        }
    },
    /**
     * 创建新场景
     * @param {string} name - 场景名称
     * @param {string} description - 场景描述（可选）
     * @returns {boolean} 创建是否成功
     */
    createScene: function (name, description) {
        try {
            // 验证参数
            if (!SceneUtils.validateSceneName(name)) {
                wx.showToast({
                    title: '场景名称无效（1-50字符）',
                    icon: 'none'
                });
                return false;
            }
            if (description !== undefined && !SceneUtils.validateSceneDescription(description)) {
                wx.showToast({
                    title: '场景描述过长（最多200字符）',
                    icon: 'none'
                });
                return false;
            }
            var trimmedName = name.trim();
            // 检查名称是否重复
            var existingScenes = this.getAllScenes();
            var nameExists = existingScenes.some(function (scene) {
                return scene.name === trimmedName;
            });
            if (nameExists) {
                wx.showToast({
                    title: '场景名称已存在',
                    icon: 'none'
                });
                return false;
            }
            // 创建新场景对象
            var newScene = SceneUtils.createScene({
                id: StorageUtils.generateUniqueId(),
                name: trimmedName,
                description: description ? description.trim() : undefined,
                isBuiltIn: false,
                usageCount: 0
            });
            // 添加到场景数组
            existingScenes.push(newScene);
            // 保存到存储
            var success = this.saveUserScenes(existingScenes);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '场景添加成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('创建场景失败:', error);
            wx.showToast({
                title: '添加失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 更新场景
     * @param {string} sceneId - 场景ID
     * @param {Object} updates - 要更新的字段
     * @returns {boolean} 更新是否成功
     */
    updateScene: function (sceneId, updates) {
        try {
            var scenes = this.getAllScenes();
            var sceneIndex = -1;
            // 查找场景
            for (var i = 0; i < scenes.length; i++) {
                if (scenes[i].id === sceneId) {
                    sceneIndex = i;
                    break;
                }
            }
            if (sceneIndex === -1) {
                wx.showToast({
                    title: '场景不存在',
                    icon: 'none'
                });
                return false;
            }
            var scene = scenes[sceneIndex];
            // 验证更新数据
            if (updates.name !== undefined) {
                if (!SceneUtils.validateSceneName(updates.name)) {
                    wx.showToast({
                        title: '场景名称无效（1-50字符）',
                        icon: 'none'
                    });
                    return false;
                }
                var trimmedName = updates.name.trim();
                if (trimmedName !== scene.name) {
                    // 检查名称重复
                    var nameExists = scenes.some(function (existingScene) {
                        return existingScene.id !== sceneId && existingScene.name === trimmedName;
                    });
                    if (nameExists) {
                        wx.showToast({
                            title: '场景名称已存在',
                            icon: 'none'
                        });
                        return false;
                    }
                    scene.name = trimmedName;
                }
            }
            if (updates.description !== undefined) {
                if (!SceneUtils.validateSceneDescription(updates.description)) {
                    wx.showToast({
                        title: '场景描述过长（最多200字符）',
                        icon: 'none'
                    });
                    return false;
                }
                scene.description = updates.description ? updates.description.trim() : undefined;
            }
            // 更新时间戳
            scene.updateTime = Date.now();
            // 保存更新
            var success = this.saveUserScenes(scenes);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '更新成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('更新场景失败:', error);
            wx.showToast({
                title: '更新失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 删除场景
     * @param {string} sceneId - 场景ID
     * @returns {boolean} 删除是否成功
     */
    deleteScene: function (sceneId) {
        try {
            var scenes = this.getAllScenes();
            var originalLength = scenes.length;
            // 过滤掉要删除的场景
            var filteredScenes = scenes.filter(function (scene) {
                return scene.id !== sceneId;
            });
            if (filteredScenes.length === originalLength) {
                wx.showToast({
                    title: '场景不存在',
                    icon: 'none'
                });
                return false;
            }
            // 检查是否有场景流程在使用此场景
            var sceneFlows = this.getAllSceneFlows();
            var usedInFlows = sceneFlows.some(function (flow) {
                return flow.sceneIds.indexOf(sceneId) !== -1;
            });
            if (usedInFlows) {
                wx.showToast({
                    title: '该场景被流程使用，无法删除',
                    icon: 'none'
                });
                return false;
            }
            // 保存更新
            var success = this.saveUserScenes(filteredScenes);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('删除场景失败:', error);
            wx.showToast({
                title: '删除失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 增加场景使用次数
     * @param {string} sceneId - 场景ID
     * @returns {boolean} 更新是否成功
     */
    incrementSceneUsage: function (sceneId) {
        try {
            var scenes = this.getAllScenes();
            var found = false;
            for (var i = 0; i < scenes.length; i++) {
                if (scenes[i].id === sceneId) {
                    scenes[i].usageCount++;
                    scenes[i].updateTime = Date.now();
                    scenes[i].lastUsedTime = Date.now();
                    found = true;
                    break;
                }
            }
            if (found) {
                this.saveUserScenes(scenes);
                this.updateDataVersion();
            }
            return found;
        }
        catch (error) {
            console.error('更新场景使用次数失败:', error);
            return false;
        }
    },
    /**
     * 保存用户场景到存储
     * @param {Object[]} scenes - 场景数组
     * @returns {boolean} 保存是否成功
     */
    saveUserScenes: function (scenes) {
        try {
            wx.setStorageSync(STORAGE_KEYS.SCENES, scenes);
            return true;
        }
        catch (error) {
            console.error('保存用户场景失败:', error);
            wx.showToast({
                title: '保存失败，存储空间可能不足',
                icon: 'none'
            });
            return false;
        }
    },
    // ==================== 场景流程相关方法 ====================
    /**
     * 获取所有场景流程数据
     * @returns {Object[]} 场景流程数组
     */
    getAllSceneFlows: function () {
        try {
            var userData = wx.getStorageSync(STORAGE_KEYS.SCENE_FLOWS);
            return userData || [];
        }
        catch (error) {
            console.error('获取场景流程数据失败:', error);
            return [];
        }
    },
    /**
     * 根据ID获取场景流程
     * @param {string} id - 场景流程ID
     * @returns {Object|null} 场景流程对象或null
     */
    getSceneFlowById: function (id) {
        if (!id) {
            return null;
        }
        try {
            var sceneFlows = this.getAllSceneFlows();
            for (var i = 0; i < sceneFlows.length; i++) {
                if (sceneFlows[i].id === id) {
                    return sceneFlows[i];
                }
            }
            return null;
        }
        catch (error) {
            console.error('获取场景流程失败:', error);
            return null;
        }
    },
    /**
     * 创建新场景流程
     * @param {string} name - 场景流程名称
     * @param {string[]} sceneIds - 场景ID数组
     * @param {string} description - 场景流程描述（可选）
     * @returns {boolean} 创建是否成功
     */
    createSceneFlow: function (name, sceneIds, description) {
        try {
            // 验证参数
            if (!SceneFlowUtils.validateSceneFlowName(name)) {
                wx.showToast({
                    title: '流程名称无效（1-50字符）',
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
                    title: '流程描述过长（最多200字符）',
                    icon: 'none'
                });
                return false;
            }
            var trimmedName = name.trim();
            // 检查名称是否重复
            var existingFlows = this.getAllSceneFlows();
            var nameExists = existingFlows.some(function (flow) {
                return flow.name === trimmedName;
            });
            if (nameExists) {
                wx.showToast({
                    title: '流程名称已存在',
                    icon: 'none'
                });
                return false;
            }
            // 验证所有场景ID都存在
            var allScenes = this.getAllScenes();
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
            // 创建新场景流程对象
            var newSceneFlow = SceneFlowUtils.createSceneFlow({
                id: StorageUtils.generateUniqueId(),
                name: trimmedName,
                description: description ? description.trim() : undefined,
                sceneIds: sceneIds,
                isBuiltIn: false,
                usageCount: 0
            });
            // 添加到场景流程数组
            existingFlows.push(newSceneFlow);
            // 保存到存储
            var success = this.saveUserSceneFlows(existingFlows);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '流程添加成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('创建场景流程失败:', error);
            wx.showToast({
                title: '添加失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 更新场景流程
     * @param {string} flowId - 场景流程ID
     * @param {Object} updates - 要更新的字段
     * @returns {boolean} 更新是否成功
     */
    updateSceneFlow: function (flowId, updates) {
        try {
            var flows = this.getAllSceneFlows();
            var flowIndex = -1;
            // 查找场景流程
            for (var i = 0; i < flows.length; i++) {
                if (flows[i].id === flowId) {
                    flowIndex = i;
                    break;
                }
            }
            if (flowIndex === -1) {
                wx.showToast({
                    title: '场景流程不存在',
                    icon: 'none'
                });
                return false;
            }
            var flow = flows[flowIndex];
            // 验证更新数据
            if (updates.name !== undefined) {
                if (!SceneFlowUtils.validateSceneFlowName(updates.name)) {
                    wx.showToast({
                        title: '流程名称无效（1-50字符）',
                        icon: 'none'
                    });
                    return false;
                }
                var trimmedName = updates.name.trim();
                if (trimmedName !== flow.name) {
                    // 检查名称重复
                    var nameExists = flows.some(function (existingFlow) {
                        return existingFlow.id !== flowId && existingFlow.name === trimmedName;
                    });
                    if (nameExists) {
                        wx.showToast({
                            title: '流程名称已存在',
                            icon: 'none'
                        });
                        return false;
                    }
                    flow.name = trimmedName;
                }
            }
            if (updates.description !== undefined) {
                if (!SceneFlowUtils.validateSceneFlowDescription(updates.description)) {
                    wx.showToast({
                        title: '流程描述过长（最多200字符）',
                        icon: 'none'
                    });
                    return false;
                }
                flow.description = updates.description ? updates.description.trim() : undefined;
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
                var allScenes = this.getAllScenes();
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
                flow.sceneIds = updates.sceneIds;
            }
            // 更新时间戳
            flow.updateTime = Date.now();
            // 保存更新
            var success = this.saveUserSceneFlows(flows);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '更新成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('更新场景流程失败:', error);
            wx.showToast({
                title: '更新失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 删除场景流程
     * @param {string} flowId - 场景流程ID
     * @returns {boolean} 删除是否成功
     */
    deleteSceneFlow: function (flowId) {
        try {
            var flows = this.getAllSceneFlows();
            var originalLength = flows.length;
            // 过滤掉要删除的场景流程
            var filteredFlows = flows.filter(function (flow) {
                return flow.id !== flowId;
            });
            if (filteredFlows.length === originalLength) {
                wx.showToast({
                    title: '场景流程不存在',
                    icon: 'none'
                });
                return false;
            }
            // 保存更新
            var success = this.saveUserSceneFlows(filteredFlows);
            if (success) {
                this.updateDataVersion();
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                });
            }
            return success;
        }
        catch (error) {
            console.error('删除场景流程失败:', error);
            wx.showToast({
                title: '删除失败，请重试',
                icon: 'none'
            });
            return false;
        }
    },
    /**
     * 增加场景流程使用次数
     * @param {string} flowId - 场景流程ID
     * @returns {boolean} 更新是否成功
     */
    incrementFlowUsage: function (flowId) {
        try {
            var flows = this.getAllSceneFlows();
            var found = false;
            for (var i = 0; i < flows.length; i++) {
                if (flows[i].id === flowId) {
                    flows[i].usageCount++;
                    flows[i].updateTime = Date.now();
                    flows[i].lastUsedTime = Date.now();
                    found = true;
                    break;
                }
            }
            if (found) {
                this.saveUserSceneFlows(flows);
                this.updateDataVersion();
            }
            return found;
        }
        catch (error) {
            console.error('更新场景流程使用次数失败:', error);
            return false;
        }
    },
    /**
     * 保存用户场景流程到存储
     * @param {Object[]} flows - 场景流程数组
     * @returns {boolean} 保存是否成功
     */
    saveUserSceneFlows: function (flows) {
        try {
            wx.setStorageSync(STORAGE_KEYS.SCENE_FLOWS, flows);
            return true;
        }
        catch (error) {
            console.error('保存用户场景流程失败:', error);
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
        }
        catch (error) {
            console.error('更新数据版本失败:', error);
        }
    },
    /**
     * 检查存储空间
     * @returns {boolean} 是否有足够存储空间
     */
    checkStorageSpace: function () {
        return StorageUtils.checkStorageSpace();
    },
    /**
     * 清空所有场景数据
     * @returns {boolean} 是否清空成功
     */
    clearAllScenes: function () {
        try {
            wx.removeStorageSync(STORAGE_KEYS.SCENES);
            wx.removeStorageSync(STORAGE_KEYS.SCENE_FLOWS);
            this.updateDataVersion();
            return true;
        }
        catch (error) {
            console.error('清空场景数据失败:', error);
            return false;
        }
    }
};
exports.SceneStorageService = SceneStorageService;
