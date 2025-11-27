require('../utils/mock-wx');
const { SceneStorageService } = require('../../build/services/sceneStorageService');

console.log('=== Testing SceneStorageService ===');

wx.clearStorageSync();

// Test Create
const success = SceneStorageService.createScene('TestScene', 'Description');
if (success) {
    console.log('PASS: Create Scene');
} else {
    console.error('FAIL: Create Scene');
    process.exit(1);
}

// Test Get
const scenes = SceneStorageService.getAllScenes();
if (scenes.length === 1 && scenes[0].name === 'TestScene') {
    console.log('PASS: Get All Scenes');
} else {
    console.error('FAIL: Get All Scenes');
    process.exit(1);
}

// Test Update
const scene = scenes[0];
const updateSuccess = SceneStorageService.updateScene(scene.id, { name: 'UpdatedScene' });
const updatedScenes = SceneStorageService.getAllScenes();
if (updateSuccess && updatedScenes[0].name === 'UpdatedScene') {
    console.log('PASS: Update Scene');
} else {
    console.error('FAIL: Update Scene');
    process.exit(1);
}

// Test Delete
const deleteSuccess = SceneStorageService.deleteScene(scene.id);
const finalScenes = SceneStorageService.getAllScenes();
if (deleteSuccess && finalScenes.length === 0) {
    console.log('PASS: Delete Scene');
} else {
    console.error('FAIL: Delete Scene');
    process.exit(1);
}
