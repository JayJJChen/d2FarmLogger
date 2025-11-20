"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SceneFlowUtils = __importStar(require("../../models/scene-flow"));
var StorageUtils = __importStar(require("../../utils/storageUtils"));
var sceneStorageService_1 = require("../../services/sceneStorageService");
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false
        },
        editMode: {
            type: Boolean,
            value: false
        },
        route: {
            type: Object,
            value: null,
            observer: function (newVal) {
                if (newVal && this.data.editMode) {
                    this.setData({
                        formData: {
                            name: newVal.name || '',
                            description: newVal.description || '',
                            sceneIds: newVal.sceneIds || [],
                            sceneNames: this.getSceneNamesByIds(newVal.sceneIds || [])
                        }
                    });
                }
            }
        }
    },
    data: {
        formData: {
            name: '',
            description: '',
            sceneIds: [],
            sceneNames: []
        },
        availableScenes: []
    },
    methods: {
        // 输入事件处理
        onNameInput: function (e) {
            this.setData({
                'formData.name': e.detail.value
            });
        },
        onDescriptionInput: function (e) {
            this.setData({
                'formData.description': e.detail.value
            });
        },
        // 加载所有场景
        loadAllScenes: function () {
            try {
                var allScenes = sceneStorageService_1.SceneStorageService.getAllScenes();
                var availableScenes = [];
                for (var i = 0; i < allScenes.length; i++) {
                    var scene = allScenes[i];
                    var selectedSceneIndex = this.data.formData.sceneIds.indexOf(scene.id);
                    availableScenes.push({
                        id: scene.id,
                        name: scene.name,
                        description: scene.description,
                        selected: selectedSceneIndex !== -1,
                        order: selectedSceneIndex !== -1 ? selectedSceneIndex + 1 : 0
                    });
                }
                this.setData({
                    availableScenes: availableScenes
                });
            }
            catch (error) {
                console.error('加载场景列表失败:', error);
            }
        },
        // 场景点击处理
        onSceneTap: function (e) {
            var sceneId = e.currentTarget.dataset.sceneId;
            var availableScenes = this.data.availableScenes;
            var formData = this.data.formData;
            // 查找点击的场景
            var sceneIndex = -1;
            for (var i = 0; i < availableScenes.length; i++) {
                if (availableScenes[i].id === sceneId) {
                    sceneIndex = i;
                    break;
                }
            }
            if (sceneIndex === -1)
                return;
            var scene = availableScenes[sceneIndex];
            if (scene.selected) {
                // 取消选择
                this.removeSceneFromSelection(sceneId);
            }
            else {
                // 添加选择
                this.addSceneToSelection(sceneId);
            }
        },
        // 添加场景到选择列表
        addSceneToSelection: function (sceneId) {
            var availableScenes = this.data.availableScenes;
            var formData = this.data.formData;
            // 查找场景
            var sceneIndex = -1;
            for (var i = 0; i < availableScenes.length; i++) {
                if (availableScenes[i].id === sceneId) {
                    sceneIndex = i;
                    break;
                }
            }
            if (sceneIndex === -1)
                return;
            var scene = availableScenes[sceneIndex];
            // 更新场景状态
            scene.selected = true;
            scene.order = formData.sceneIds.length + 1;
            // 更新表单数据
            formData.sceneIds.push(sceneId);
            formData.sceneNames.push(scene.name);
            // 更新界面
            this.setData({
                availableScenes: availableScenes,
                'formData.sceneIds': formData.sceneIds,
                'formData.sceneNames': formData.sceneNames
            });
        },
        // 从选择列表移除场景
        removeSceneFromSelection: function (sceneId) {
            var availableScenes = this.data.availableScenes;
            var formData = this.data.formData;
            // 查找并移除场景
            var removedIndex = -1;
            for (var i = 0; i < formData.sceneIds.length; i++) {
                if (formData.sceneIds[i] === sceneId) {
                    removedIndex = i;
                    break;
                }
            }
            if (removedIndex === -1)
                return;
            // 从表单数据中移除
            formData.sceneIds.splice(removedIndex, 1);
            formData.sceneNames.splice(removedIndex, 1);
            // 重新排序所有已选择的场景
            for (var i = 0; i < availableScenes.length; i++) {
                if (availableScenes[i].selected) {
                    var currentOrder = availableScenes[i].order;
                    if (currentOrder > removedIndex + 1) {
                        availableScenes[i].order = currentOrder - 1;
                    }
                    else if (currentOrder === removedIndex + 1) {
                        availableScenes[i].selected = false;
                        availableScenes[i].order = 0;
                    }
                }
            }
            // 更新界面
            this.setData({
                availableScenes: availableScenes,
                'formData.sceneIds': formData.sceneIds,
                'formData.sceneNames': formData.sceneNames
            });
        },
        // 上移场景
        moveSceneUp: function (e) {
            var sceneId = e.currentTarget.dataset.sceneId;
            var formData = this.data.formData;
            // 查找场景在已选择列表中的位置
            var currentIndex = -1;
            for (var i = 0; i < formData.sceneIds.length; i++) {
                if (formData.sceneIds[i] === sceneId) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex <= 0)
                return; // 已经在第一个位置
            // 交换位置
            var tempId = formData.sceneIds[currentIndex];
            var tempName = formData.sceneNames[currentIndex];
            formData.sceneIds[currentIndex] = formData.sceneIds[currentIndex - 1];
            formData.sceneNames[currentIndex] = formData.sceneNames[currentIndex - 1];
            formData.sceneIds[currentIndex - 1] = tempId;
            formData.sceneNames[currentIndex - 1] = tempName;
            // 更新availableScenes中的顺序
            this.updateSceneOrders(formData.sceneIds);
            this.setData({
                'formData.sceneIds': formData.sceneIds,
                'formData.sceneNames': formData.sceneNames,
                availableScenes: this.data.availableScenes
            });
        },
        // 下移场景
        moveSceneDown: function (e) {
            var sceneId = e.currentTarget.dataset.sceneId;
            var formData = this.data.formData;
            // 查找场景在已选择列表中的位置
            var currentIndex = -1;
            for (var i = 0; i < formData.sceneIds.length; i++) {
                if (formData.sceneIds[i] === sceneId) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex >= formData.sceneIds.length - 1 || currentIndex === -1)
                return; // 已经在最后一个位置
            // 交换位置
            var tempId = formData.sceneIds[currentIndex];
            var tempName = formData.sceneNames[currentIndex];
            formData.sceneIds[currentIndex] = formData.sceneIds[currentIndex + 1];
            formData.sceneNames[currentIndex] = formData.sceneNames[currentIndex + 1];
            formData.sceneIds[currentIndex + 1] = tempId;
            formData.sceneNames[currentIndex + 1] = tempName;
            // 更新availableScenes中的顺序
            this.updateSceneOrders(formData.sceneIds);
            this.setData({
                'formData.sceneIds': formData.sceneIds,
                'formData.sceneNames': formData.sceneNames,
                availableScenes: this.data.availableScenes
            });
        },
        // 更新场景顺序
        updateSceneOrders: function (sceneIds) {
            var availableScenes = this.data.availableScenes;
            // 先重置所有场景
            for (var i = 0; i < availableScenes.length; i++) {
                availableScenes[i].selected = false;
                availableScenes[i].order = 0;
            }
            // 按新顺序设置已选择的场景
            for (var i = 0; i < sceneIds.length; i++) {
                var sceneId = sceneIds[i];
                for (var j = 0; j < availableScenes.length; j++) {
                    if (availableScenes[j].id === sceneId) {
                        availableScenes[j].selected = true;
                        availableScenes[j].order = i + 1;
                        break;
                    }
                }
            }
        },
        // 根据场景ID获取场景名称
        getSceneNamesByIds: function (sceneIds) {
            try {
                var sceneNames = [];
                for (var i = 0; i < sceneIds.length; i++) {
                    var sceneId = sceneIds[i];
                    var scene = sceneStorageService_1.SceneStorageService.getSceneById(sceneId);
                    if (scene) {
                        sceneNames.push(scene.name);
                    }
                    else {
                        sceneNames.push('[未知场景]');
                    }
                }
                return sceneNames;
            }
            catch (error) {
                console.error('获取场景名称失败:', error);
                return sceneIds.map(function (id) { return '[未知场景]'; });
            }
        },
        // 生成场景预览文本
        generatePreviewText: function () {
            var sceneNames = this.data.formData.sceneNames;
            if (sceneNames.length === 0) {
                return '请选择场景';
            }
            return SceneFlowUtils.generateScenePreview(sceneNames);
        },
        // 验证表单
        validateForm: function () {
            var formData = this.data.formData;
            // 验证名称
            if (!formData.name || !formData.name.trim()) {
                return { isValid: false, message: '请输入路线名称' };
            }
            if (!SceneFlowUtils.validateSceneFlowName(formData.name.trim())) {
                return { isValid: false, message: '路线名称只能是1-50个中英文字符和常见符号' };
            }
            // 验证描述
            if (!SceneFlowUtils.validateSceneFlowDescription(formData.description)) {
                return { isValid: false, message: '路线描述过长（最多200字符）' };
            }
            // 验证场景选择
            if (!formData.sceneIds || formData.sceneIds.length === 0) {
                return { isValid: false, message: '请至少选择一个场景' };
            }
            return { isValid: true };
        },
        // 提交表单
        onSubmit: function () {
            console.log('🟢 MF路线表单提交按钮被点击');
            console.log('📝 表单数据:', this.data.formData);
            console.log('📋 编辑模式:', this.data.editMode);
            var validation = this.validateForm();
            if (!validation.isValid) {
                console.log('❌ 表单验证失败:', validation.message);
                wx.showToast({
                    title: validation.message,
                    icon: 'none'
                });
                return;
            }
            console.log('✅ 表单验证通过');
            var formData = this.data.formData;
            var routeData = {
                name: formData.name.trim(),
                sceneIds: formData.sceneIds
            };
            // 添加可选字段
            if (formData.description) {
                routeData.description = formData.description.trim();
            }
            console.log('🚀 准备提交的路线数据:', routeData);
            if (this.data.editMode && this.data.route) {
                // 编辑模式：保留原有ID和时间信息
                console.log('✏️ 编辑模式：更新现有路线');
                var updatedRoute = StorageUtils.extendObject({}, this.data.route);
                updatedRoute = StorageUtils.extendObject(updatedRoute, routeData);
                updatedRoute.updateTime = Date.now();
                console.log('📤 触发编辑事件:', updatedRoute);
                this.triggerEvent('submit', {
                    type: 'edit',
                    route: updatedRoute
                });
            }
            else {
                // 创建模式：生成新路线
                console.log('➕ 创建模式：创建新路线');
                var newRoute = StorageUtils.extendObject({}, routeData);
                // ID会在页面中生成，这里不设置
                newRoute.createTime = Date.now();
                newRoute.updateTime = Date.now();
                newRoute.isBuiltIn = false;
                newRoute.usageCount = 0;
                console.log('📤 触发创建事件:', newRoute);
                this.triggerEvent('submit', {
                    type: 'create',
                    route: newRoute
                });
            }
            console.log('✅ MF路线表单提交完成');
        },
        // 取消操作
        onCancel: function () {
            this.triggerEvent('cancel');
        },
        // 遮罩点击
        onOverlayTap: function () {
            this.triggerEvent('cancel');
        },
        // 内容区域点击（阻止冒泡）
        onContentTap: function () {
            // 阻止事件冒泡，防止modal被意外关闭
        },
        // 重置表单
        resetForm: function () {
            this.setData({
                formData: {
                    name: '',
                    description: '',
                    sceneIds: [],
                    sceneNames: []
                }
            });
        }
    },
    lifetimes: {
        attached: function () {
            if (!this.data.editMode) {
                this.resetForm();
            }
            // 加载所有场景
            this.loadAllScenes();
        }
    }
});
