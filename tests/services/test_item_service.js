require('../utils/mock-wx');
const { ItemStorageService } = require('../../build/services/itemStorageService');
const { ITEM_CATEGORIES } = require('../../build/models/item-library');

console.log('=== Testing ItemStorageService ===');

wx.clearStorageSync();

// Test Create
// user categories are first 5
const category = ITEM_CATEGORIES[0]; // Unique
const success = ItemStorageService.createItem('Shako', category);

if (success) {
    console.log('PASS: Create Item');
} else {
    console.error('FAIL: Create Item');
    process.exit(1);
}

// Test Get
const items = ItemStorageService.getAllItems();
// Built-in items + 1
const builtInCount = items.filter(function(i) { return i.isBuiltIn; }).length;
if (items.length > builtInCount) {
    console.log('PASS: Get Items');
} else {
    console.error('FAIL: Get Items');
    process.exit(1);
}

// Test Update
const userItems = ItemStorageService.getUserItems();
const item = userItems[0];
const updateSuccess = ItemStorageService.updateItem(item.id, { name: 'Harlequin Crest' });
const updatedItems = ItemStorageService.getUserItems();

if (updateSuccess && updatedItems[0].name === 'Harlequin Crest') {
    console.log('PASS: Update Item');
} else {
    console.error('FAIL: Update Item');
    process.exit(1);
}

// Test Delete
const deleteSuccess = ItemStorageService.deleteItem(item.id);
const finalItems = ItemStorageService.getUserItems();
if (deleteSuccess && finalItems.length === 0) {
    console.log('PASS: Delete Item');
} else {
    console.error('FAIL: Delete Item');
    process.exit(1);
}
