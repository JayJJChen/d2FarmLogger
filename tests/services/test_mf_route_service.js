require('../utils/mock-wx');
const { MFRouteStorageService } = require('../../build/services/mfRouteStorageService');
const { SceneStorageService } = require('../../build/services/sceneStorageService');

console.log('=== Testing MFRouteStorageService ===');

wx.clearStorageSync();

// Test Create
// We need scenes first
SceneStorageService.createScene('Scene1', 'Desc');
const scenes = SceneStorageService.getAllScenes();
const sceneId = scenes[0].id;

const success = MFRouteStorageService.createRoute('Route1', [sceneId], 'Desc');
if (success) {
    console.log('PASS: Create Route');
} else {
    console.error('FAIL: Create Route');
    process.exit(1);
}

// Test Get
const routes = MFRouteStorageService.getAllRoutes();
if (routes.length === 1 && routes[0].name === 'Route1') {
    console.log('PASS: Get Routes');
} else {
    console.error('FAIL: Get Routes');
    process.exit(1);
}

// Test Update
const route = routes[0];
const updateSuccess = MFRouteStorageService.updateRoute(route.id, { name: 'Route1 Updated' });
const updatedRoutes = MFRouteStorageService.getAllRoutes();
if (updateSuccess && updatedRoutes[0].name === 'Route1 Updated') {
    console.log('PASS: Update Route');
} else {
    console.error('FAIL: Update Route');
    process.exit(1);
}

// Test Delete
const deleteSuccess = MFRouteStorageService.deleteRoute(route.id);
const finalRoutes = MFRouteStorageService.getAllRoutes();
if (deleteSuccess && finalRoutes.length === 0) {
    console.log('PASS: Delete Route');
} else {
    console.error('FAIL: Delete Route');
    process.exit(1);
}
