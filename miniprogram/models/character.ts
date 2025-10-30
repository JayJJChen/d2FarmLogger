export enum CharacterClass {
  Sorceress = '法师',
  Paladin = '圣骑士',
  Necromancer = '死灵法师',
  Amazon = '亚马逊',
  Barbarian = '野蛮人',
  Druid = '德鲁伊',
  Assassin = '刺客'
}

export interface Character {
  // 基本信息字段
  id: string
  name: string
  class: CharacterClass
  level?: number
  magicFind?: number
  defaultSceneIds?: string[]

  // 存储相关字段
  createTime: number
  updateTime: number
  lastUsedTime?: number
}

/**
 * ES5兼容的对象合并函数
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function extendObject(target: any, source: any): any {
  if (!target) {
    target = {}
  }
  if (!source) {
    return target
  }

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
  return target
}

/**
 * 创建角色对象
 * @param data 角色数据
 * @returns 完整的角色对象
 */
export function createCharacter(data: any): Character {
  var character: Character = {
    id: data.id || '',
    name: data.name || '',
    class: data.class || CharacterClass.Sorceress,
    createTime: data.createTime || Date.now(),
    updateTime: data.updateTime || Date.now()
  }

  // 可选字段
  if (data.level !== undefined && data.level !== null) {
    character.level = data.level
  }
  if (data.magicFind !== undefined && data.magicFind !== null) {
    character.magicFind = data.magicFind
  }
  if (data.defaultSceneIds) {
    character.defaultSceneIds = data.defaultSceneIds
  }
  if (data.lastUsedTime) {
    character.lastUsedTime = data.lastUsedTime
  }

  return character
}

/**
 * 验证角色名称
 * @param name 角色名称
 * @returns 是否有效
 */
export function validateCharacterName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false
  }
  if (name.length < 1 || name.length > 20) {
    return false
  }
  // 检查是否只包含中英文数字
  var pattern = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  return pattern.test(name)
}

/**
 * 验证等级
 * @param level 等级
 * @returns 是否有效
 */
export function validateLevel(level: any): boolean {
  if (level === undefined || level === null) {
    return true // 等级是可选的
  }
  if (typeof level !== 'number') {
    return false
  }
  if (level < 1 || level > 99) {
    return false
  }
  if (level !== Math.floor(level)) {
    return false // 必须是整数
  }
  return true
}

/**
 * 验证MF值
 * @param magicFind MF值
 * @returns 是否有效
 */
export function validateMagicFind(magicFind: any): boolean {
  if (magicFind === undefined || magicFind === null) {
    return true // MF值是可选的
  }
  if (typeof magicFind !== 'number') {
    return false
  }
  if (magicFind < 0 || magicFind > 9999) {
    return false
  }
  if (magicFind !== Math.floor(magicFind)) {
    return false // 必须是整数
  }
  return true
}