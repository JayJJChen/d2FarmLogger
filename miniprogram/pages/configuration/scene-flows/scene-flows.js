"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneStorageService = require('../services/sceneStorageService');
Page({
    data: {
        sceneFlows: []
    },
    onLoad() {
        this.loadSceneFlows();
    },
    /**
     * 加载场景流程数据
     */
    loadSceneFlows() {
        try {
            // 从存储服务获取场景流程数据
            const sceneFlows = SceneStorageService.SceneStorageService.getAllSceneFlows();
            const allScenes = SceneStorageService.SceneStorageService.getAllScenes();
            
            // 创建场景ID到名称的映射
            const sceneMap = {};
            allScenes.forEach(scene => {
                sceneMap[scene.id] = scene.name;
            });
            
            // 添加场景预览和时间格式化
            const processedSceneFlows = sceneFlows.map(flow => {
                // 生成场景预览文本
                const scenesPreview = flow.sceneIds.map(sceneId => {
                    return sceneMap[sceneId] || '未知场景';
                }).join(' → ');
                
                return {
                    ...flow,
                    sceneCount: flow.sceneIds.length,
                    scenesPreview: scenesPreview,
                    updateTimeText: this.formatTime(flow.updateTime),
                    createTimeText: this.formatTime(flow.createTime),
                    usageCountText: this.getUsageCountText(flow.usageCount)
                };
            });
            
            this.setData({
                sceneFlows: processedSceneFlows
            });
        } catch (error) {
            console.error('加载场景流程数据失败:', error);
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            });
        }
    },
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        if (days === 0) {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours === 0) {
                const minutes = Math.floor(diff / (60 * 1000));
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
            const date = new Date(timestamp);
            return (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }
    },

    /**
     * 格式化使用次数
     */
    getUsageCountText(count) {
        if (count === 0) {
            return '未使用';
        } else if (count < 10) {
            return count + '次';
        } else if (count < 100) {
            return count + '次';
        } else {
            return '99+次';
        }
    },
    /**
     * 查看场景流程详情
     */
    viewSceneFlow(e) {
        const item = e.currentTarget.dataset.item;
        
        // 获取所有场景信息
        const allScenes = SceneStorageService.SceneStorageService.getAllScenes();
        const sceneMap = {};
        allScenes.forEach(scene => {
            sceneMap[scene.id] = scene.name;
        });
        
        // 生成详细信息
        const sceneDetails = item.sceneIds.map(sceneId => {
            return sceneMap[sceneId] || '未知场景';
        }).join('\n');
        
        wx.showModal({
            title: `流程详情: ${item.name}`,
            content: `包含场景:\n${sceneDetails}\n\n使用次数: ${item.usageCountText}\n创建时间: ${item.createTimeText}`,
            showCancel: false,
            confirmText: '确定'
        });
    },

    /**
     * 编辑场景流程
     */
    editSceneFlow(e) {
        const item = e.currentTarget.dataset.item;
        
        // 显示编辑对话框
        wx.showModal({
            title: '编辑流程',
            editable: true,
            placeholderText: '流程名称',
            content: item.name,
            success: (res) => {
                if (res.confirm && res.content) {
                    const newName = res.content.trim();
                    if (newName && newName !== item.name) {
                        // 调用存储服务更新场景流程
                        const success = SceneStorageService.SceneStorageService.updateSceneFlow(item.id, {
                            name: newName
                        });
                        
                        if (success) {
                            // 重新加载数据
                            this.loadSceneFlows();
                        }
                    } else if (newName === item.name) {
                        wx.showToast({
                            title: '名称未变化',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    },

    /**
     * 删除场景流程
     */
    deleteSceneFlow(e) {
        const item = e.currentTarget.dataset.item;
        
        wx.showModal({
            title: '确认删除',
            content: `确定要删除流程"${item.name}"吗？`,
            success: (res) => {
                if (res.confirm) {
                    // 调用存储服务删除场景流程
                    const success = SceneStorageService.SceneStorageService.deleteSceneFlow(item.id);
                    
                    if (success) {
                        // 重新加载数据
                        this.loadSceneFlows();
                    }
                }
            }
        });
    },

    /**
     * 添加新场景流程
     */
    addSceneFlow() {
        // 获取所有可用场景
        const allScenes = SceneStorageService.SceneStorageService.getAllScenes();
        
        if (allScenes.length === 0) {
            wx.showToast({
                title: '请先添加场景',
                icon: 'none'
            });
            return;
        }
        
        // 显示场景选择列表
        const sceneNames = allScenes.map(scene => scene.name);
        wx.showActionSheet({
            itemList: sceneNames,
            success: (res) => {
                if (!res.cancel) {
                    const selectedScenes = [allScenes[res.tapIndex].id];
                    
                    // 显示流程名称输入对话框
                    wx.showModal({
                        title: '添加流程',
                        editable: true,
                        placeholderText: '请输入流程名称',
                        content: '',
                        success: (nameRes) => {
                            if (nameRes.confirm && nameRes.content) {
                                const flowName = nameRes.content.trim();
                                if (flowName) {
                                    // 调用存储服务创建场景流程
                                    const success = SceneStorageService.SceneStorageService.createSceneFlow(
                                        flowName,
                                        selectedScenes
                                    );
                                    
                                    if (success) {
                                        // 重新加载数据
                                        this.loadSceneFlows();
                                    }
                                } else {
                                    wx.showToast({
                                        title: '流程名称不能为空',
                                        icon: 'none'
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    },
    onShow() {
        this.loadSceneFlows();
    }
});
