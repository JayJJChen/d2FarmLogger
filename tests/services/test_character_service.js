require('../utils/mock-wx');
const { CharacterStorageService } = require('../../build/services/characterStorageService');
const { CharacterClass } = require('../../build/models/character');

console.log('=== Testing CharacterStorageService ===');

// Clear storage
wx.clearStorageSync();

// Test Create
const newChar = {
    id: CharacterStorageService.generateCharacterId(),
    name: 'TestChar',
    class: '法师', // Using string value as enum might be compiled
    level: 90,
    magicFind: 300,
    createTime: Date.now(),
    updateTime: Date.now()
};

const success = CharacterStorageService.createCharacter(newChar);
if (success) {
    console.log('PASS: Create Character');
} else {
    console.error('FAIL: Create Character');
    process.exit(1);
}

// Test Get All
const chars = CharacterStorageService.getAllCharacters();
if (chars.length === 1 && chars[0].name === 'TestChar') {
    console.log('PASS: Get All Characters');
} else {
    console.error('FAIL: Get All Characters', chars);
    process.exit(1);
}

// Test Update
const charToUpdate = chars[0];
charToUpdate.level = 91;
const updateSuccess = CharacterStorageService.updateCharacter(charToUpdate);
const updatedChars = CharacterStorageService.getAllCharacters();
if (updateSuccess && updatedChars[0].level === 91) {
    console.log('PASS: Update Character');
} else {
    console.error('FAIL: Update Character');
    process.exit(1);
}

// Test Delete
const deleteSuccess = CharacterStorageService.deleteCharacter(charToUpdate.id);
const finalChars = CharacterStorageService.getAllCharacters();
if (deleteSuccess && finalChars.length === 0) {
    console.log('PASS: Delete Character');
} else {
    console.error('FAIL: Delete Character');
    process.exit(1);
}
