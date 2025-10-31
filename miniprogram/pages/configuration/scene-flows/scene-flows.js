"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mock场景数据
var mockScenes = {
    'countess': '女伯爵',
    'andariel': '安达利尔',
    'summoner': '召唤者',
    'nilathak': '尼拉塞克',
    'mephisto': '墨菲斯托',
    'diablo': '迪亚波罗',
    'baal': '巴尔',
    'pindleskin': 'P叔'
};
Page({
    data: {
        sceneFlows: []
    },
    onLoad: function () {
        this.loadSceneFlows();
    },
    /**
     * 加载场景流程数据
     */
    loadSceneFlows: function () {
        var _this = this;
        // Mock数据
        var mockSceneFlows = [
            {
                id: '1',
                name: 'Key Run',
                sceneIds: ['countess', 'summoner', 'nilathak'],
                sceneCount: 3,
                isBuiltIn: true,
                usageCount: 0,
                createTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
                updateTime: Date.now() - 2 * 24 * 60 * 60 * 1000
            },
            {
                id: '2',
                name: 'KM (仅墨菲斯托)',
                sceneIds: ['mephisto'],
                sceneCount: 1,
                isBuiltIn: true,
                usageCount: 0,
                createTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
                updateTime: Date.now() - 3 * 24 * 60 * 60 * 1000
            },
            {
                id: '3',
                name: '85场景全刷',
                sceneIds: ['countess', 'andariel', 'summoner', 'nilathak', 'mephisto', 'diablo', 'baal'],
                sceneCount: 7,
                isBuiltIn: false,
                usageCount: 0,
                createTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
                updateTime: Date.now() - 1 * 24 * 60 * 60 * 1000
            }
        ];
        // 添加场景预览和时间格式化
        var processedSceneFlows = mockSceneFlows.map(function (flow) {
            var scenesPreview = '';
            if (flow.id === '1') {
                scenesPreview = '女伯爵 → 召唤者 → 尼拉塞克';
            }
            else if (flow.id === '2') {
                scenesPreview = '墨菲斯托';
            }
            else if (flow.id === '3') {
                scenesPreview = '女伯爵 → 安达利尔 → 召唤者 → 尼拉塞克 → 墨菲斯托 → 迪亚波罗 → 巴尔';
            }
            return __assign(__assign({}, flow), { scenesPreview: scenesPreview, updateTimeText: _this.formatTime(flow.updateTime) });
        });
        this.setData({
            sceneFlows: processedSceneFlows
        });
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
     * 查看场景流程详情
     */
    viewSceneFlow: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.showToast({
            title: "\u67E5\u770B\u6D41\u7A0B: ".concat(item.name),
            icon: 'none'
        });
    },
    /**
     * 编辑场景流程
     */
    editSceneFlow: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.showToast({
            title: "\u7F16\u8F91\u6D41\u7A0B: ".concat(item.name),
            icon: 'none'
        });
    },
    /**
     * 删除场景流程
     */
    deleteSceneFlow: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        var index = this.data.sceneFlows.findIndex(function (flow) { return flow.id === item.id; });
        if (item.isBuiltIn) {
            wx.showToast({
                title: '内置流程不能删除',
                icon: 'none'
            });
            return;
        }
        wx.showModal({
            title: '确认删除',
            content: "\u786E\u5B9A\u8981\u5220\u9664\u6D41\u7A0B\"".concat(item.name, "\"\u5417\uFF1F"),
            success: function (res) {
                if (res.confirm) {
                    var sceneFlows = _this.data.sceneFlows;
                    sceneFlows.splice(index, 1);
                    _this.setData({
                        sceneFlows: sceneFlows
                    });
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                }
            }
        });
    },
    /**
     * 添加新场景流程
     */
    addSceneFlow: function () {
        wx.showToast({
            title: '新增流程功能开发中',
            icon: 'none'
        });
    },
    onShow: function () {
        this.loadSceneFlows();
    }
});
