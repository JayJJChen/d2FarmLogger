"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = require("../../../models/session");
var CharacterStorageService = require('../../../services/characterStorageService').CharacterStorageService;
var SceneStorageService = require('../../../services/sceneStorageService').SceneStorageService;
var SessionStorageService = require('../../../services/sessionStorageService').SessionStorageService;
var StorageUtils = require('../../../utils/storageUtils');
Page({
    data: {
        character: null,
        scenes: [],
        selectedSceneIds: [],
        targetType: session_1.SessionTargetType.None,
        targetValue: '',
        targetTypes: [
            { name: '直接开始', value: session_1.SessionTargetType.None },
            { name: '固定次数', value: session_1.SessionTargetType.RunCount },
            { name: '固定时间(分)', value: session_1.SessionTargetType.Time }
        ]
    },
    onLoad: function (options) {
        if (options && options.characterId) {
            this.loadCharacter(options.characterId);
        }
        else {
            this.loadScenes();
        }
    },
    loadCharacter: function (id) {
        var characters = CharacterStorageService.getAllCharacters();
        var character = null;
        for (var i = 0; i < characters.length; i++) {
            if (characters[i].id === id) {
                character = characters[i];
                break;
            }
        }
        if (character) {
            this.setData({
                character: character,
                selectedSceneIds: character.defaultSceneIds || []
            });
            this.loadScenes();
        }
    },
    loadScenes: function () {
        var scenes = SceneStorageService.getAllScenes();
        var selectedIds = this.data.selectedSceneIds;
        // Add checked property for UI
        var scenesWithCheck = scenes.map(function (s) {
            var checked = false;
            if (selectedIds) {
                for (var i = 0; i < selectedIds.length; i++) {
                    if (selectedIds[i] === s.id) {
                        checked = true;
                        break;
                    }
                }
            }
            s.checked = checked;
            return s;
        });
        this.setData({
            scenes: scenesWithCheck
        });
    },
    onSceneChange: function (e) {
        this.setData({
            selectedSceneIds: e.detail.value
        });
    },
    onTargetTypeChange: function (e) {
        this.setData({
            targetType: e.detail.value
        });
    },
    onTargetValueInput: function (e) {
        this.setData({
            targetValue: e.detail.value
        });
    },
    onStart: function () {
        var character = this.data.character;
        if (!character) {
            wx.showToast({
                title: '未选择角色',
                icon: 'none'
            });
            return;
        }
        var selectedSceneIds = this.data.selectedSceneIds;
        if (!selectedSceneIds || selectedSceneIds.length === 0) {
            wx.showToast({
                title: '请至少选择一个场景',
                icon: 'none'
            });
            return;
        }
        var targetType = this.data.targetType;
        var targetValue = parseInt(this.data.targetValue, 10);
        if (targetType !== session_1.SessionTargetType.None && (!targetValue || targetValue <= 0)) {
            wx.showToast({
                title: '请输入有效的目标数值',
                icon: 'none'
            });
            return;
        }
        // Get Scene Snapshots
        var scenes = this.data.scenes;
        var sceneSnapshots = [];
        for (var i = 0; i < scenes.length; i++) {
            var s = scenes[i];
            // Check if selected
            var isSelected = false;
            for (var j = 0; j < selectedSceneIds.length; j++) {
                if (selectedSceneIds[j] === s.id) {
                    isSelected = true;
                    break;
                }
            }
            if (isSelected) {
                sceneSnapshots.push({ id: s.id, name: s.name });
            }
        }
        // Create Session
        var sessionData = {
            id: StorageUtils.generateUniqueId('session'),
            characterId: character.id,
            characterSnapshot: {
                name: character.name,
                class: character.class,
                level: character.level,
                magicFind: character.magicFind
            },
            sceneIds: selectedSceneIds,
            sceneSnapshots: sceneSnapshots,
            target: {
                type: targetType,
                value: targetType === session_1.SessionTargetType.None ? undefined : targetValue
            },
            status: session_1.SessionStatus.Active,
            startTime: Date.now(),
            runCount: 0,
            drops: []
        };
        var session = (0, session_1.createSession)(sessionData);
        if (SessionStorageService.saveCurrentSession(session)) {
            wx.redirectTo({
                url: '/pages/sessions/session'
            });
        }
        else {
            wx.showToast({
                title: '启动失败',
                icon: 'none'
            });
        }
    }
});
