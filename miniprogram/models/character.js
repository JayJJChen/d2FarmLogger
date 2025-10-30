"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterClass = void 0;
exports.extendObject = extendObject;
exports.createCharacter = createCharacter;
exports.validateCharacterName = validateCharacterName;
exports.validateLevel = validateLevel;
exports.validateMagicFind = validateMagicFind;
var CharacterClass;
(function (CharacterClass) {
    CharacterClass["Sorceress"] = "\u6CD5\u5E08";
    CharacterClass["Paladin"] = "\u5723\u9A91\u58EB";
    CharacterClass["Necromancer"] = "\u6B7B\u7075\u6CD5\u5E08";
    CharacterClass["Amazon"] = "\u4E9A\u9A6C\u900A";
    CharacterClass["Barbarian"] = "\u91CE\u86EE\u4EBA";
    CharacterClass["Druid"] = "\u5FB7\u9C81\u4F0A";
    CharacterClass["Assassin"] = "\u523A\u5BA2";
})(CharacterClass || (exports.CharacterClass = CharacterClass = {}));
/**
 * ES5兼容的对象合并函数
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function extendObject(target, source) {
    if (!target) {
        target = {};
    }
    if (!source) {
        return target;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}
/**
 * 创建角色对象
 * @param data 角色数据
 * @returns 完整的角色对象
 */
function createCharacter(data) {
    var character = {
        id: data.id || '',
        name: data.name || '',
        class: data.class || CharacterClass.Sorceress,
        createTime: data.createTime || Date.now(),
        updateTime: data.updateTime || Date.now()
    };
    // 可选字段
    if (data.level !== undefined && data.level !== null) {
        character.level = data.level;
    }
    if (data.magicFind !== undefined && data.magicFind !== null) {
        character.magicFind = data.magicFind;
    }
    if (data.defaultSceneIds) {
        character.defaultSceneIds = data.defaultSceneIds;
    }
    if (data.lastUsedTime) {
        character.lastUsedTime = data.lastUsedTime;
    }
    return character;
}
/**
 * 验证角色名称
 * @param name 角色名称
 * @returns 是否有效
 */
function validateCharacterName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }
    if (name.length < 1 || name.length > 20) {
        return false;
    }
    // 检查是否只包含中英文数字
    var pattern = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
    return pattern.test(name);
}
/**
 * 验证等级
 * @param level 等级
 * @returns 是否有效
 */
function validateLevel(level) {
    if (level === undefined || level === null) {
        return true; // 等级是可选的
    }
    if (typeof level !== 'number') {
        return false;
    }
    if (level < 1 || level > 99) {
        return false;
    }
    if (level !== Math.floor(level)) {
        return false; // 必须是整数
    }
    return true;
}
/**
 * 验证MF值
 * @param magicFind MF值
 * @returns 是否有效
 */
function validateMagicFind(magicFind) {
    if (magicFind === undefined || magicFind === null) {
        return true; // MF值是可选的
    }
    if (typeof magicFind !== 'number') {
        return false;
    }
    if (magicFind < 0 || magicFind > 9999) {
        return false;
    }
    if (magicFind !== Math.floor(magicFind)) {
        return false; // 必须是整数
    }
    return true;
}
