// 测试场景存储功能
const SceneStorageService = require('./miniprogram/services/sceneStorageService');

console.log('=== 测试场景存储功能 ===');

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

// 测试4: 更新场景
console.log('\n4. 测试更新场景:');
if (scenesAfterCreate.length > 0) {
  const updateResult = SceneStorageService.SceneStorageService.updateScene(
    scenesAfterCreate[0].id,
    { name: '更新后的场景名称', description: '更新后的描述' }
  );
  console.log('更新结果:', updateResult);
}

console.log('\n=== 测试完成 ===');
