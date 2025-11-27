"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CharacterStorageService = require('../../services/characterStorageService').CharacterStorageService;
Page({
    data: {
        characters: [],
        showForm: false,
        editMode: false,
        editingCharacter: null,
        _sceneType: null
    },
    onLoad: function () {
        this.loadCharacters();
    },
    onShow: function () {
        this.loadCharacters();
    },
    loadCharacters: function () {
        try {
            var characters = CharacterStorageService.getAllCharacters();
            this.setData({
                characters: characters
            });
        }
        catch (error) {
            console.error('加载角色数据失败:', error);
            wx.showToast({
                title: '加载失败',
                icon: 'none'
            });
        }
    },
    onAddCharacter: function () {
        this.setData({
            showForm: true,
            editMode: false,
            editingCharacter: null
        });
    },
    onCharacterEdit: function (e) {
        var character = e.detail.character;
        this.setData({
            showForm: true,
            editMode: true,
            editingCharacter: character
        });
    },
    onCharacterConfig: function (e) {
        var character = e.detail.character;
        wx.navigateTo({
            url: '/pages/configuration/scene-flows/scene-flows?selectMode=true&characterId=' + character.id
        });
    },
    onCharacterStartSession: function (e) {
        var character = e.detail.character;
        if (!character.defaultSceneIds || character.defaultSceneIds.length === 0) {
            wx.showModal({
                title: '提示',
                content: character.name + ' 还没有配置默认场景列表，请先配置后再开始Session。',
                showCancel: true,
                cancelText: '取消',
                confirmText: '去配置',
                success: function (res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/configuration/configuration'
                        });
                    }
                }
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/sessions/start/start?characterId=' + character.id
        });
    },
    onCharacterDelete: function (e) {
        var _this = this;
        var character = e.detail.character;
        wx.showModal({
            title: '确认删除',
            content: '确定要删除人物"' + character.name + '"吗？此操作不可恢复。',
            showCancel: true,
            cancelText: '取消',
            confirmText: '删除',
            confirmColor: '#ff4444',
            success: function (res) {
                if (res.confirm) {
                    _this.deleteCharacter(character.id);
                }
            }
        });
    },
    deleteCharacter: function (characterId) {
        try {
            var success = CharacterStorageService.deleteCharacter(characterId);
            if (success) {
                this.loadCharacters();
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                });
            }
            else {
                wx.showToast({
                    title: '删除失败',
                    icon: 'none'
                });
            }
        }
        catch (error) {
            console.error('删除角色失败:', error);
            wx.showToast({
                title: '删除失败',
                icon: 'none'
            });
        }
    },
    onFormSubmit: function (e) {
        var _a = e.detail, type = _a.type, character = _a.character;
        if (type === 'create') {
            this.createCharacter(character);
        }
        else if (type === 'edit') {
            this.updateCharacter(character);
        }
        this.setData({
            showForm: false,
            editMode: false,
            editingCharacter: null
        });
    },
    onFormCancel: function () {
        this.setData({
            showForm: false,
            editMode: false,
            editingCharacter: null
        });
    },
    createCharacter: function (character) {
        try {
            // 生成角色ID
            if (!character.id) {
                character.id = CharacterStorageService.generateCharacterId();
            }
            var success = CharacterStorageService.createCharacter(character);
            if (success) {
                this.loadCharacters();
                wx.showToast({
                    title: '创建成功',
                    icon: 'success'
                });
            }
            else {
                wx.showToast({
                    title: '创建失败',
                    icon: 'none'
                });
            }
        }
        catch (error) {
            console.error('创建角色失败:', error);
            wx.showToast({
                title: '创建失败',
                icon: 'none'
            });
        }
    },
    updateCharacter: function (character) {
        try {
            var success = CharacterStorageService.updateCharacter(character);
            if (success) {
                this.loadCharacters();
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
            }
            else {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                });
            }
        }
        catch (error) {
            console.error('更新角色失败:', error);
            wx.showToast({
                title: '保存失败',
                icon: 'none'
            });
        }
    }
});
