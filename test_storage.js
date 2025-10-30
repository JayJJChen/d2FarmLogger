// 简单的存储功能测试脚本
// 在微信开发者工具控制台中运行

// 模拟微信API（仅用于测试）
if (typeof wx === 'undefined') {
  global.wx = {
    getStorageSync: function(key) {
      // 模拟从localStorage读取
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    setStorageSync: function(key, data) {
      // 模拟写入localStorage
      localStorage.setItem(key, JSON.stringify(data));
    },
    removeStorageSync: function(key) {
      // 模拟删除localStorage
      localStorage.removeItem(key);
    },
    getStorageInfoSync: function() {
      // 模拟存储信息
      return {
        keys: Object.keys(localStorage),
        currentSize: JSON.stringify(localStorage).length,
        limitSize: 10240 * 1024 // 10MB
      };
    },
    showToast: function(options) {
      console.log('Toast:', options.title);
    }
  };
}

// 导入存储服务
const { CharacterStorageService } = require('./miniprogram/services/characterStorageService.js');

// 测试函数
function testStorage() {
  console.log('开始测试角色存储功能...');

  // 1. 清空现有数据
  console.log('\n1. 清空现有数据');
  CharacterStorageService.clearAllCharacters();
  let characters = CharacterStorageService.getAllCharacters();
  console.log('清空后的角色数量:', characters.length);

  // 2. 创建测试角色
  console.log('\n2. 创建测试角色');
  const testCharacter1 = {
    id: 'test_001',
    name: '测试法师',
    class: '法师',
    level: 85,
    magicFind: 500
  };

  const testCharacter2 = {
    id: 'test_002',
    name: '测试圣骑士',
    class: '圣骑士',
    level: 90,
    magicFind: 300
  };

  // 3. 测试创建角色
  console.log('\n3. 测试创建角色');
  let success = CharacterStorageService.createCharacter(testCharacter1);
  console.log('创建角色1结果:', success);

  success = CharacterStorageService.createCharacter(testCharacter2);
  console.log('创建角色2结果:', success);

  // 4. 测试获取所有角色
  console.log('\n4. 测试获取所有角色');
  characters = CharacterStorageService.getAllCharacters();
  console.log('当前角色数量:', characters.length);
  console.log('角色列表:', characters);

  // 5. 测试根据ID获取角色
  console.log('\n5. 测试根据ID获取角色');
  let character = CharacterStorageService.getCharacterById('test_001');
  console.log('获取到的角色:', character);

  // 6. 测试更新角色
  console.log('\n6. 测试更新角色');
  testCharacter1.level = 86;
  testCharacter1.magicFind = 600;
  success = CharacterStorageService.updateCharacter(testCharacter1);
  console.log('更新角色结果:', success);

  // 7. 验证更新结果
  console.log('\n7. 验证更新结果');
  character = CharacterStorageService.getCharacterById('test_001');
  console.log('更新后的角色:', character);

  // 8. 测试删除角色
  console.log('\n8. 测试删除角色');
  success = CharacterStorageService.deleteCharacter('test_002');
  console.log('删除角色结果:', success);

  // 9. 验证删除结果
  console.log('\n9. 验证删除结果');
  characters = CharacterStorageService.getAllCharacters();
  console.log('删除后角色数量:', characters.length);

  // 10. 测试数据验证
  console.log('\n10. 测试数据验证');
  const invalidCharacter = {
    id: 'invalid_001',
    name: '', // 无效的空名称
    class: '法师'
  };
  success = CharacterStorageService.createCharacter(invalidCharacter);
  console.log('创建无效角色结果:', success);

  console.log('\n测试完成！');
}

// 如果是直接运行此脚本
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testStorage };
} else {
  // 如果在浏览器中运行
  testStorage();
}