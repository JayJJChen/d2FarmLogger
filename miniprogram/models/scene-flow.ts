// 场景流程接口定义
export interface SceneFlow {
  id: string
  name: string
  description?: string
  sceneIds: string[]
  isBuiltIn: boolean
  usageCount: number
  createTime: number
  updateTime: number
  lastUsedTime?: number
  sceneCount?: number // 临时字段，用于兼容现有mock数据
}

/**
 * 创建场景流程对象
 * @param {any} data - 场景流程数据
 * @returns {Object} 完整的场景流程对象
 */
function createSceneFlow(data: any): SceneFlow {
  var sceneFlow: any = {
    id: data.id || '',
    name: data.name || '',
    sceneIds: data.sceneIds || [],
    isBuiltIn: data.isBuiltIn || false,
    usageCount: data.usageCount || 0,
    createTime: data.createTime || Date.now(),
    updateTime: data.updateTime || Date.now()
  }

  // 可选字段
  if (data.description) {
    sceneFlow.description = data.description
  }
  if (data.lastUsedTime) {
    sceneFlow.lastUsedTime = data.lastUsedTime
  }

  return sceneFlow
}

/**
 * 验证场景流程名称
 * @param {string} name - 场景流程名称
 * @returns {boolean} 是否有效
 */
function validateSceneFlowName(name) {
  if (!name || typeof name !== 'string') {
    return false
  }
  if (name.length < 1 || name.length > 50) {
    return false
  }
  // 检查是否只包含中英文数字和常见符号
  var pattern = /^[a-zA-Z0-9\u4e00-\u9fa5\s\-\(\)\[\]]+$/
  return pattern.test(name)
}

/**
 * 验证场景流程描述
 * @param {any} description - 场景流程描述
 * @returns {boolean} 是否有效
 */
function validateSceneFlowDescription(description) {
  if (description === undefined || description === null) {
    return true // 描述是可选的
  }
  if (typeof description !== 'string') {
    return false
  }
  if (description.length > 200) {
    return false
  }
  return true
}

/**
 * 验证场景ID数组
 * @param {any} sceneIds - 场景ID数组
 * @returns {boolean} 是否有效
 */
function validateSceneIds(sceneIds) {
  if (!Array.isArray(sceneIds)) {
    return false
  }
  if (sceneIds.length === 0) {
    return false // 至少需要一个场景
  }
  if (sceneIds.length > 20) {
    return false // 最多20个场景
  }
  // 检查每个ID是否为非空字符串
  for (var i = 0; i < sceneIds.length; i++) {
    if (typeof sceneIds[i] !== 'string' || sceneIds[i].trim() === '') {
      return false
    }
  }
  return true
}

module.exports = {
  createSceneFlow: createSceneFlow,
  validateSceneFlowName: validateSceneFlowName,
  validateSceneFlowDescription: validateSceneFlowDescription,
  validateSceneIds: validateSceneIds
};
