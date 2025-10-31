"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建场景对象
 * @param {any} data - 场景数据
 * @returns {Object} 完整的场景对象
 */
function createScene(data) {
    var scene = {
        id: data.id || '',
        name: data.name || '',
        isBuiltIn: data.isBuiltIn || false,
        usageCount: data.usageCount || 0,
        createTime: data.createTime || Date.now(),
        updateTime: data.updateTime || Date.now()
    };
    // 可选字段
    if (data.description) {
        scene.description = data.description;
    }
    if (data.lastUsedTime) {
        scene.lastUsedTime = data.lastUsedTime;
    }
    return scene;
}
/**
 * 验证场景名称
 * @param {string} name - 场景名称
 * @returns {boolean} 是否有效
 */
function validateSceneName(name) {
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
 * 验证场景描述
 * @param {any} description - 场景描述
 * @returns {boolean} 是否有效
 */
function validateSceneDescription(description) {
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
module.exports = {
    createScene: createScene,
    validateSceneName: validateSceneName,
    validateSceneDescription: validateSceneDescription
};
