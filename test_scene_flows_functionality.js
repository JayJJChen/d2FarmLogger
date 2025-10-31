// 测试场景流程页面功能
// 模拟微信小程序环境
global.wx = {
  getStorageSync: function(key) {
    if (!this._storage) {
      this._storage = {};
    }
    return this._storage[key] || null;
  },
  setStorageSync: function(key, data) {
    if (!this._storage) {
      this._storage = {};
    }
    this._storage[key] = data;
    return true;
  },
  removeStorageSync: function(key) {
    if (!this._storage) {
      this._storage = {};
    }
    delete this._storage[key];
    return true;
  },
  showToast: function(options) {
    console.log('Toast:', options.title);
  },
  showModal: function(options) {
    console.log('Modal:', options.title, options.content);
    if (options.success) {
      options.success({ confirm: true, content: options.content || 'test' });
    }
  },
  showActionSheet: function(options) {
    console.log('ActionSheet:', options.itemList);
    if (options.success) {
      options.success({ tapIndex: 0, cancel: false });
    }
  }
};

// 模拟页面环境
global.Page = function(pageConfig) {
  const page = {
    data: pageConfig.data || {},
    setData: function(newData) {
      Object.assign(this.data, newData);
      console.log('Page data updated:', this.data);
    }
  };
  
  // 复制所有页面方法
  Object.keys(pageConfig).forEach(key => {
    if (key !== 'data') {
      page[key] = pageConfig[key].bind(page);
    }
  });
  
  // 模拟页面加载
  if (pageConfig.onLoad) {
    pageConfig.onLoad.call(page);
  }
  
  return page;
};

// 测试场景流程页面
console.log('=== 测试场景流程页面功能 ===');

// 加载场景流程页面逻辑
const SceneStorageService = require('./miniprogram/services/sceneStorageService');

// 模拟页面
const sceneFlowPage = Page({
  data: {
    sceneFlows: []
  },
  onLoad() {
    this.loadSceneFlows();
  },
  loadSceneFlows() {
    try {
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
    }
  },
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
  getUsageCountText(count) {
    if (count === 0) {
      return '未使用';
    } else if (count < 10) {
      return count + '次';
    } else {
      return '99+次';
    }
  },
  addSceneFlow() {
    console.log('测试新增场景流程功能');
    // 先创建一个测试场景
    const sceneSuccess = SceneStorageService.SceneStorageService.createScene('测试场景');
    
    if (sceneSuccess) {
      const allScenes = SceneStorageService.SceneStorageService.getAllScenes();
      const selectedScenes = [allScenes[0].id];
      
      const success = SceneStorageService.SceneStorageService.createSceneFlow(
        '测试流程',
        selectedScenes
      );
      
      console.log('创建流程结果:', success);
      
      if (success) {
        this.loadSceneFlows();
      }
    }
  }
});

console.log('初始流程数量:', sceneFlowPage.data.sceneFlows.length);

// 测试新增流程
sceneFlowPage.addSceneFlow();

console.log('新增后流程数量:', sceneFlowPage.data.sceneFlows.length);
if (sceneFlowPage.data.sceneFlows.length > 0) {
  console.log('新增流程成功:', sceneFlowPage.data.sceneFlows[0].name);
}

console.log('=== 场景流程页面功能测试完成 ===');
