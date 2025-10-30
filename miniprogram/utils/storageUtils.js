// 存储工具函数
// 提供ES5兼容的存储操作工具
/**
 * 深度克隆对象（ES5兼容版本）
 * @param {any} obj - 要克隆的对象
 * @returns {any} 克隆后的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
        var clonedArray = [];
        for (var i = 0; i < obj.length; i++) {
            clonedArray[i] = deepClone(obj[i]);
        }
        return clonedArray;
    }
    var clonedObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}
/**
 * 安全的JSON序列化
 * @param {any} data - 要序列化的数据
 * @returns {string|null} JSON字符串或null
 */
function safeJSONStringify(data) {
    try {
        return JSON.stringify(data);
    }
    catch (error) {
        console.error('JSON序列化失败:', error);
        return null;
    }
}
/**
 * 安全的JSON反序列化
 * @param {string} jsonString - JSON字符串
 * @returns {any|null} 解析后的对象或null
 */
function safeJSONParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.error('JSON反序列化失败:', error);
        return null;
    }
}
/**
 * 检查存储空间是否足够
 * @param {number} requiredSize - 需要的大小（字节）
 * @returns {boolean} 是否足够
 */
function checkStorageSpace(requiredSize) {
    try {
        var storageInfo = wx.getStorageInfoSync();
        var availableSpace = storageInfo.limitSize - storageInfo.currentSize;
        return availableSpace >= requiredSize;
    }
    catch (error) {
        console.error('检查存储空间失败:', error);
        return false;
    }
}
/**
 * 获取数据大小（字节）
 * @param {any} data - 要计算的数据
 * @returns {number} 数据大小（字节）
 */
function getDataSize(data) {
    var jsonString = safeJSONStringify(data);
    if (!jsonString) {
        return 0;
    }
    // 在微信小程序环境中使用字符串长度估算大小
    // UTF-8编码下，中文字符占3字节，英文字符占1字节
    var size = 0;
    for (var i = 0; i < jsonString.length; i++) {
        var charCode = jsonString.charCodeAt(i);
        if (charCode < 128) {
            size += 1; // ASCII字符
        }
        else if (charCode < 2048) {
            size += 2; // 2字节Unicode
        }
        else {
            size += 3; // 3字节Unicode（包括中文）
        }
    }
    return size;
}
/**
 * 清理过期的存储数据
 * @param {string} keyPrefix - 键前缀
 * @param {number} maxAge - 最大保留时间（毫秒）
 * @returns {number} 清理的项目数量
 */
function cleanExpiredData(keyPrefix, maxAge) {
    try {
        var storageInfo = wx.getStorageInfoSync();
        var keys = storageInfo.keys;
        var cleanedCount = 0;
        var now = Date.now();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.indexOf(keyPrefix) === 0) {
                try {
                    var data = wx.getStorageSync(key);
                    if (data && data.timestamp && (now - data.timestamp) > maxAge) {
                        wx.removeStorageSync(key);
                        cleanedCount++;
                    }
                }
                catch (error) {
                    console.error('清理数据失败:', key, error);
                }
            }
        }
        return cleanedCount;
    }
    catch (error) {
        console.error('清理过期数据失败:', error);
        return 0;
    }
}
/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    var size = bytes / Math.pow(1024, i);
    var roundedSize = Math.round(size * 100) / 100;
    return roundedSize + ' ' + sizes[i];
}
/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀
 * @returns {string} 唯一ID
 */
function generateUniqueId(prefix) {
    prefix = prefix || 'id';
    var timestamp = Date.now();
    var random = Math.floor(Math.random() * 10000);
    return prefix + '_' + timestamp + '_' + random;
}
/**
 * 安全设置存储数据
 * @param {string} key - 存储键
 * @param {any} data - 存储数据
 * @returns {boolean} 是否成功
 */
function safeSetStorage(key, data) {
    try {
        var dataSize = getDataSize(data);
        if (!checkStorageSpace(dataSize)) {
            console.error('存储空间不足');
            wx.showToast({
                title: '存储空间不足',
                icon: 'none'
            });
            return false;
        }
        wx.setStorageSync(key, data);
        return true;
    }
    catch (error) {
        console.error('存储数据失败:', error);
        wx.showToast({
            title: '存储失败',
            icon: 'none'
        });
        return false;
    }
}
/**
 * 安全获取存储数据
 * @param {string} key - 存储键
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储数据或默认值
 */
function safeGetStorage(key, defaultValue) {
    try {
        var data = wx.getStorageSync(key);
        return data !== '' ? data : defaultValue;
    }
    catch (error) {
        console.error('获取存储数据失败:', error);
        return defaultValue;
    }
}
/**
 * 移除存储数据
 * @param {string} key - 存储键
 * @returns {boolean} 是否成功
 */
function safeRemoveStorage(key) {
    try {
        wx.removeStorageSync(key);
        return true;
    }
    catch (error) {
        console.error('移除存储数据失败:', error);
        return false;
    }
}
module.exports = {
    deepClone: deepClone,
    safeJSONStringify: safeJSONStringify,
    safeJSONParse: safeJSONParse,
    checkStorageSpace: checkStorageSpace,
    getDataSize: getDataSize,
    cleanExpiredData: cleanExpiredData,
    formatFileSize: formatFileSize,
    generateUniqueId: generateUniqueId,
    safeSetStorage: safeSetStorage,
    safeGetStorage: safeGetStorage,
    safeRemoveStorage: safeRemoveStorage
};
