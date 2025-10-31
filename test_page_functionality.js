// 测试页面功能
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

// 测试场景库页面
console.log('=== 测试场景库页面功能 ===');

// 加载场景库页面逻辑
const SceneStorageService = require('./miniprogram/services/sceneStorageService');

// 模拟页面
const scenePage = Page({
  data: {
    scenes: []
  },
  onLoad() {
    this.loadScenes();
  },
  loadScenes() {
    try {
      const scenes = SceneStorageService.SceneStorageService.getAllScenes();
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
  addScene() {
    console.log('测试新增场景功能');
    // 模拟用户输入场景名称
    const testSceneName = '测试场景';
    
    const success = SceneStorageService.SceneStorageService.createScene(testSceneName);
    console.log('创建场景结果:', success);
    
    if (success) {
      this.loadScenes();
    }
  }
});

console.log('初始场景数量:', scenePage.data.scenes.length);

// 测试新增场景
scenePage.addScene();

console.log('新增后场景数量:', scenePage.data.scenes.length);
if (scenePage.data.scenes.length > 0) {
  console.log('新增场景成功:', scenePage.data.scenes[0].name);
}

console.log('=== 场景库页面功能测试完成 ===');
