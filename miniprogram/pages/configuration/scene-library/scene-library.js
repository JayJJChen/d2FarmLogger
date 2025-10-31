"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneStorageService = require('../services/sceneStorageService');
Page({
    data: {
        scenes: []
    },
    onLoad() {
        this.loadScenes();
    },
    /**
     * 加载场景数据
     */
    loadScenes() {
        try {
            // 初始化默认场景（如果需要）
            SceneStorageService.SceneStorageService.initializeDefaultScenes();

            // 从存储服务获取场景数据
            const scenes = SceneStorageService.SceneStorageService.getAllScenes();
            
            // 添加时间格式化
            const processedScenes = scenes.map(scene => {
                return {
                    ...scene,
                    createTimeText: this.formatTime(scene.createTime),
                    updateTimeText: this.formatTime(scene.updateTime),
                    usageCountText: this.getUsageCountText(scene.usageCount)
                };
            });
            
            this.setData({
                scenes: processedScenes
            });
        } catch (error) {
            console.error('加载场景数据失败:', error);
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
        else if (days < 30) {
            const weeks = Math.floor(days / 7);
            return weeks + '周前';
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
     * 编辑场景
     */
    editScene(e) {
        const item = e.currentTarget.dataset.item;
        
        // 显示编辑对话框
        wx.showModal({
            title: '编辑场景',
            editable: true,
            placeholderText: '场景名称',
            content: item.name,
            success: (res) => {
                if (res.confirm && res.content) {
                    const newName = res.content.trim();
                    if (newName && newName !== item.name) {
                        // 调用存储服务更新场景
                        const success = SceneStorageService.SceneStorageService.updateScene(item.id, {
                            name: newName
                        });
                        
                        if (success) {
                            // 重新加载数据
                            this.loadScenes();
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
     * 删除场景
     */
    deleteScene(e) {
        const item = e.currentTarget.dataset.item;
        
        wx.showModal({
            title: '确认删除',
            content: `确定要删除场景"${item.name}"吗？`,
            success: (res) => {
                if (res.confirm) {
                    // 调用存储服务删除场景
                    const success = SceneStorageService.SceneStorageService.deleteScene(item.id);
                    
                    if (success) {
                        // 重新加载数据
                        this.loadScenes();
                    }
                }
            }
        });
    },

    /**
     * 添加新场景
     */
    addScene() {
        wx.showModal({
            title: '添加场景',
            editable: true,
            placeholderText: '请输入场景名称',
            success: (res) => {
                if (res.confirm && res.content) {
                    const name = res.content.trim();
                    if (name) {
                        // 调用存储服务创建场景
                        const success = SceneStorageService.SceneStorageService.createScene(name);
                        
                        if (success) {
                            // 重新加载数据
                            this.loadScenes();
                        }
                    } else {
                        wx.showToast({
                            title: '场景名称不能为空',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    },
    onShow() {
        this.loadScenes();
    }
});
