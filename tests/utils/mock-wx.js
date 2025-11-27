global.wx = {
  storage: {},
  getStorageSync: function(key) {
    return this.storage[key] || '';
  },
  setStorageSync: function(key, data) {
    this.storage[key] = data;
  },
  removeStorageSync: function(key) {
    delete this.storage[key];
  },
  clearStorageSync: function() {
    this.storage = {};
  },
  getStorageInfoSync: function() {
    return {
      keys: Object.keys(this.storage),
      currentSize: 0,
      limitSize: 1024 * 1024
    };
  },
  showToast: function() { },
  showModal: function() { }
};

module.exports = global.wx;
