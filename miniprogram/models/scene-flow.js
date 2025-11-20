"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSceneFlow = createSceneFlow;
exports.validateSceneFlowName = validateSceneFlowName;
exports.validateSceneFlowDescription = validateSceneFlowDescription;
exports.validateSceneIds = validateSceneIds;
exports.generateScenePreview = generateScenePreview;
exports.validateRouteScenes = validateRouteScenes;
exports.reorderSceneIds = reorderSceneIds;
/**
 * 创建场景流程对象
 * @param {any} data - 场景流程数据
 * @returns {Object} 完整的场景流程对象
 */
function createSceneFlow(data) {
    var sceneFlow = {
        id: data.id || '',
        name: data.name || '',
        sceneIds: data.sceneIds || [],
        isBuiltIn: data.isBuiltIn || false,
        usageCount: data.usageCount || 0,
        createTime: data.createTime || Date.now(),
        updateTime: data.updateTime || Date.now()
    };
    // 可选字段
    if (data.description) {
        sceneFlow.description = data.description;
    }
    if (data.lastUsedTime) {
        sceneFlow.lastUsedTime = data.lastUsedTime;
    }
    return sceneFlow;
}
/**
 * 验证场景流程名称
 * @param {string} name - 场景流程名称
 * @returns {boolean} 是否有效
 */
function validateSceneFlowName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }
    if (name.length < 1 || name.length > 50) {
        return false;
    }
    // 检查是否只包含中英文数字和常见符号
    var pattern = /^[a-zA-Z0-9\u4e00-\u9fa5\s\-\(\)\[\]]+$/;
    return pattern.test(name);
}
/**
 * 验证场景流程描述
 * @param {any} description - 场景流程描述
 * @returns {boolean} 是否有效
 */
function validateSceneFlowDescription(description) {
    if (description === undefined || description === null) {
        return true; // 描述是可选的
    }
    if (typeof description !== 'string') {
        return false;
    }
    if (description.length > 200) {
        return false;
    }
    return true;
}
/**
 * 验证场景ID数组
 * @param {any} sceneIds - 场景ID数组
 * @returns {boolean} 是否有效
 */
function validateSceneIds(sceneIds) {
    if (!Array.isArray(sceneIds)) {
        return false;
    }
    if (sceneIds.length === 0) {
        return false; // 至少需要一个场景
    }
    if (sceneIds.length > 20) {
        return false; // 最多20个场景
    }
    // 检查每个ID是否为非空字符串
    for (var i = 0; i < sceneIds.length; i++) {
        if (typeof sceneIds[i] !== 'string' || sceneIds[i].trim() === '') {
            return false;
        }
    }
    return true;
}
/**
 * 生成场景预览文本
 * @param {Array} sceneNames - 场景名称数组
 * @returns {string} 预览文本
 */
function generateScenePreview(sceneNames) {
    if (!Array.isArray(sceneNames) || sceneNames.length === 0) {
        return '暂无场景';
    }
    var preview = sceneNames.slice(0, 3).join(' → ');
    if (sceneNames.length > 3) {
        preview = preview + ' ...(' + sceneNames.length + '个场景)';
    }
    return preview;
}
/**
 * 验证路线场景顺序
 * @param {Array} sceneIds - 场景ID数组
 * @param {Array} availableSceneIds - 可用场景ID数组
 * @returns {boolean} 是否有效
 */
function validateRouteScenes(sceneIds, availableSceneIds) {
    if (!validateSceneIds(sceneIds)) {
        return false;
    }
    if (!Array.isArray(availableSceneIds)) {
        return false;
    }
    // 检查所有选择的场景都存在于可用场景中
    for (var i = 0; i < sceneIds.length; i++) {
        var sceneExists = false;
        for (var j = 0; j < availableSceneIds.length; j++) {
            if (sceneIds[i] === availableSceneIds[j]) {
                sceneExists = true;
                break;
            }
        }
        if (!sceneExists) {
            return false;
        }
    }
    return true;
}
/**
 * 调整场景顺序
 * @param {Array} sceneIds - 场景ID数组
 * @param {number} fromIndex - 源位置索引
 * @param {number} toIndex - 目标位置索引
 * @returns {Array} 调整后的数组
 */
function reorderSceneIds(sceneIds, fromIndex, toIndex) {
    if (!Array.isArray(sceneIds)) {
        return [];
    }
    var result = sceneIds.slice(); // 复制数组
    // 检查索引有效性
    if (fromIndex < 0 || fromIndex >= result.length ||
        toIndex < 0 || toIndex >= result.length ||
        fromIndex === toIndex) {
        return result;
    }
    // 移动元素
    var item = result.splice(fromIndex, 1)[0];
    result.splice(toIndex, 0, item);
    return result;
}
