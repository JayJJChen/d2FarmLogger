"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneStorageService = require('../../../services/sceneStorageService').SceneStorageService;
var MFRouteStorageService = require('../../../services/mfRouteStorageService').MFRouteStorageService;
var StorageUtils = require('../../../utils/storageUtils');
Page({
    data: {
        sceneFlows: [],
        showRouteForm: false,
        editingRoute: null,
        editMode: false
    },
    onLoad: function () {
        this.loadSceneFlows();
    },
    /**
     * 加载MF路线数据
     */
    loadSceneFlows: function () {
        try {
            // 从MF路线存储服务获取数据
            var routes = MFRouteStorageService.getAllRoutes();
            // 为每个路线添加场景预览信息
            var processedRoutes = [];
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                var scenesPreview = this.generateScenesPreview(route.sceneIds);
                var processedRoute = StorageUtils.extendObject({}, route);
                processedRoute.scenesPreview = scenesPreview;
                processedRoute.updateTimeText = this.formatTime(route.updateTime);
                processedRoute.sceneCount = route.sceneIds.length;
                processedRoutes.push(processedRoute);
            }
            this.setData({
                sceneFlows: processedRoutes
            });
        }
        catch (error) {
            console.error('加载MF路线失败:', error);
            this.setData({
                sceneFlows: []
            });
        }
    },
    /**
     * 生成场景预览文本
     * @param sceneIds 场景ID数组
     * @returns 场景预览文本
     */
    generateScenesPreview: function (sceneIds) {
        try {
            if (!sceneIds || sceneIds.length === 0) {
                return '无场景';
            }
            var sceneNames = [];
            for (var i = 0; i < sceneIds.length; i++) {
                var sceneId = sceneIds[i];
                var scene = SceneStorageService.getSceneById(sceneId);
                if (scene) {
                    sceneNames.push(scene.name);
                }
                else {
                    sceneNames.push('[未知场景]');
                }
            }
            return sceneNames.join(' → ');
        }
        catch (error) {
            console.error('生成场景预览失败:', error);
            return '生成预览失败';
        }
    },
    /**
     * 格式化时间
     */
    formatTime: function (timestamp) {
        var now = Date.now();
        var diff = now - timestamp;
        var days = Math.floor(diff / (24 * 60 * 60 * 1000));
        if (days === 0) {
            var hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours === 0) {
                var minutes = Math.floor(diff / (60 * 1000));
                return minutes === 0 ? '刚刚' : minutes + '分钟前';
            }
            return hours + '小时前';
        }
        else if (days === 1) {
            return '昨天';
        }
        else if (days < 7) {
            return days + '天前';
        }
        else {
            var date = new Date(timestamp);
            return (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }
    },
    /**
     * 查看MF路线详情
     */
    viewSceneFlow: function (e) {
        var item = e.currentTarget.dataset.item;
        var sceneDetails = this.generateDetailedScenesPreview(item.sceneIds);
        wx.showModal({
            title: '路线详情',
            content: '路线名称：' + item.name + '\n场景数量：' + item.sceneIds.length + '个\n使用次数：' + item.usageCount + '次\n\n场景顺序：\n' + sceneDetails,
            showCancel: false,
            confirmText: '确定'
        });
    },
    /**
     * 编辑MF路线
     */
    editSceneFlow: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.isBuiltIn) {
            wx.showToast({
                title: '内置路线不能编辑',
                icon: 'none'
            });
            return;
        }
        this.setData({
            editingRoute: item,
            editMode: true,
            showRouteForm: true
        });
    },
    /**
     * 删除MF路线
     */
    deleteSceneFlow: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        if (item.isBuiltIn) {
            wx.showToast({
                title: '内置路线不能删除',
                icon: 'none'
            });
            return;
        }
        wx.showModal({
            title: '确认删除',
            content: '确定要删除路线"' + item.name + '"吗？此操作不可恢复。',
            success: function (res) {
                if (res.confirm) {
                    // 使用MF路线存储服务删除
                    var success = MFRouteStorageService.deleteRoute(item.id);
                    if (success) {
                        _this.loadSceneFlows(); // 重新加载数据
                    }
                }
            }
        });
    },
    /**
     * 生成详细的场景预览文本
     * @param sceneIds 场景ID数组
     * @returns 详细场景预览文本
     */
    generateDetailedScenesPreview: function (sceneIds) {
        try {
            if (!sceneIds || sceneIds.length === 0) {
                return '无场景';
            }
            var sceneLines = [];
            for (var i = 0; i < sceneIds.length; i++) {
                var sceneId = sceneIds[i];
                var scene = SceneStorageService.getSceneById(sceneId);
                if (scene) {
                    sceneLines.push((i + 1) + '. ' + scene.name);
                }
                else {
                    sceneLines.push((i + 1) + '. [未知场景]');
                }
            }
            return sceneLines.join('\n');
        }
        catch (error) {
            console.error('生成详细场景预览失败:', error);
            return '生成预览失败';
        }
    },
    /**
     * 添加新MF路线
     */
    addSceneFlow: function () {
        console.log('🟢 新增路线按钮被点击');
        console.log('🔍 当前状态:', {
            showRouteForm: this.data.showRouteForm,
            editMode: this.data.editMode,
            editingRoute: this.data.editingRoute
        });
        this.setData({
            editingRoute: null,
            editMode: false,
            showRouteForm: true
        });
        console.log('✅ 设置后的状态:', {
            showRouteForm: this.data.showRouteForm,
            editMode: this.data.editMode,
            editingRoute: this.data.editingRoute
        });
    },
    /**
     * MF路线表单提交处理
     */
    onRouteFormSubmit: function (e) {
        console.log('🎯 MF路线表单提交事件触发');
        console.log('📥 事件详情:', e.detail);
        var type = e.detail.type;
        var route = e.detail.route;
        console.log('🔍 操作类型:', type);
        console.log('🛣️ 路线数据:', route);
        if (type === 'create') {
            // 创建新路线
            console.log('➕ 开始创建新路线');
            var success = MFRouteStorageService.createRoute(route.name, route.sceneIds, route.description);
            console.log('📊 创建结果:', success);
            if (success) {
                console.log('✅ 路线创建成功，重新加载数据');
                this.loadSceneFlows();
            }
            else {
                console.log('❌ 路线创建失败');
            }
        }
        else if (type === 'edit') {
            // 更新现有路线
            console.log('✏️ 开始更新路线');
            var updates = {
                name: route.name,
                sceneIds: route.sceneIds,
                description: route.description
            };
            var success = MFRouteStorageService.updateRoute(route.id, updates);
            console.log('📊 更新结果:', success);
            if (success) {
                console.log('✅ 路线更新成功，重新加载数据');
                this.loadSceneFlows();
            }
            else {
                console.log('❌ 路线更新失败');
            }
        }
        console.log('🔚 关闭表单');
        this.closeRouteForm();
    },
    /**
     * MF路线表单取消处理
     */
    onRouteFormCancel: function () {
        this.closeRouteForm();
    },
    /**
     * 关闭路线表单
     */
    closeRouteForm: function () {
        this.setData({
            showRouteForm: false,
            editingRoute: null,
            editMode: false
        });
    },
    onShow: function () {
        this.loadSceneFlows();
    }
});
