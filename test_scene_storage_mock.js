// 模拟微信小程序wx对象进行测试
global.wx = {
  getStorageSync: function(key) {
    // 模拟存储，使用内存对象
    if (!this._storage) {
      this._storage = {};
    }
    return this._storage[key] || null;
  },
  setStorageSync: function(key, data) {
    // 模拟存储
    if (!this._storage) {
      this._storage = {};
    }
    this._storage[key] = data;
    return true;
  },
  removeStorageSync: function(key) {
    // 模拟删除存储
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
      options.success({ confirm: true });
    }
  },
  showActionSheet: function(options) {
    console.log('ActionSheet:', options.itemList);
    if (options.success) {
      options.success({ tapIndex: 0, cancel: false });
    }
  }
};

const SceneStorageService = require('./miniprogram/services/sceneStorageService');

console.log('=== 测试场景存储功能（模拟环境）===');

// 测试1: 获取所有场景（应该为空）
console.log('\n1. 测试获取所有场景:');
const scenes = SceneStorageService.SceneStorageService.getAllScenes();
console.log('场景数量:', scenes.length);

// 测试2: 创建场景
console.log('\n2. 测试创建场景:');
const createResult = SceneStorageService.SceneStorageService.createScene('测试场景', '这是一个测试场景描述');
console.log('创建结果:', createResult);

// 测试3: 再次获取场景
console.log('\n3. 测试再次获取场景:');
const scenesAfterCreate = SceneStorageService.SceneStorageService.getAllScenes();
console.log('场景数量:', scenesAfterCreate.length);
if (scenesAfterCreate.length > 0) {
  console.log('第一个场景:', scenesAfterCreate[0]);
}

// 测试4: 创建场景流程
console.log('\n4. 测试创建场景流程:');
if (scenesAfterCreate.length > 0) {
  const flowResult = SceneStorageService.SceneStorageService.createSceneFlow(
    '测试流程',
    [scenesAfterCreate[0].id],
    '这是一个测试流程'
  );
  console.log('创建流程结果:', flowResult);
}

// 测试5: 获取所有场景流程
console.log('\n5. 测试获取所有场景流程:');
const flows = SceneStorageService.SceneStorageService.getAllSceneFlows();
console.log('流程数量:', flows.length);
if (flows.length > 0) {
  console.log('第一个流程:', flows[0]);
}

// 测试6: 更新场景
console.log('\n6. 测试更新场景:');
if (scenesAfterCreate.length > 0) {
  const updateResult = SceneStorageService.SceneStorageService.updateScene(
    scenesAfterCreate[0].id,
    { name: '更新后的场景名称' }
  );
  console.log('更新结果:', updateResult);
}

// 测试7: 删除场景流程
console.log('\n7. 测试删除场景流程:');
if (flows.length > 0) {
  const deleteFlowResult = SceneStorageService.SceneStorageService.deleteSceneFlow(flows[0].id);
  console.log('删除流程结果:', deleteFlowResult);
}

// 测试8: 最终检查
console.log('\n8. 最终检查:');
const finalScenes = SceneStorageService.SceneStorageService.getAllScenes();
const finalFlows = SceneStorageService.SceneStorageService.getAllSceneFlows();
console.log('最终场景数量:', finalScenes.length);
console.log('最终流程数量:', finalFlows.length);

console.log('\n=== 测试完成 ===');
