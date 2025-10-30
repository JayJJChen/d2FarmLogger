import { Character } from '../../models/character'

Component({
  properties: {
    character: {
      type: Object,
      value: null,
      observer: function(newVal: Character) {
        if (newVal) {
          this.setData({
            displayInfo: this.formatDisplayInfo(newVal)
          })
        }
      }
    }
  },

  data: {
    displayInfo: '',
    translateX: 0,
    isSliding: false,
    startX: 0,
    startTime: 0,
    currentX: 0,
    deleteBtnWidth: 120
  },

  methods: {
    formatDisplayInfo(character: Character): string {
      let info = character.name
      if (character.level) {
        info += ' (Lvl ' + character.level
      } else {
        info += ' (Lvl ??'
      }

      if (character.class) {
        info += ' ' + character.class
      }

      if (character.magicFind && character.magicFind > 0) {
        info += ' MF=' + character.magicFind
      }

      info += ')'
      return info
    },

    onEditTap() {
      this.triggerEvent('edit', { character: this.data.character })
    },

    onConfigTap() {
      this.triggerEvent('config', { character: this.data.character })
    },

    onDeleteTap() {
      var self = this
      wx.showModal({
        title: '删除确认',
        content: '确定要删除角色「' + this.data.character.name + '」吗？此操作无法撤销。',
        confirmText: '删除',
        confirmColor: '#ff5252',
        success: function(res) {
          if (res.confirm) {
            // 重置滑动状态
            self.setData({
              translateX: 0,
              isSliding: false
            })
            // 触发删除事件
            self.triggerEvent('delete', { character: self.data.character })
          }
        }
      })
    },

    onStartSessionTap() {
      this.triggerEvent('startsession', { character: this.data.character })
    },

    onTouchStart(e) {
      this.setData({
        startX: e.touches[0].clientX,
        startTime: new Date().getTime(),
        currentX: e.touches[0].clientX
      })
    },

    onTouchMove(e) {
      var moveX = e.touches[0].clientX
      var deltaX = moveX - this.data.startX

      // 只允许左滑
      if (deltaX > 0) {
        return
      }

      // 限制最大滑动距离
      var maxDistance = -this.data.deleteBtnWidth
      var translateX = Math.max(deltaX, maxDistance)

      this.setData({
        currentX: moveX,
        translateX: translateX,
        isSliding: true
      })
    },

    onTouchEnd(e) {
      var endTime = new Date().getTime()
      var deltaTime = endTime - this.data.startTime
      var deltaX = this.data.currentX - this.data.startX

      // 计算滑动速度
      var velocity = Math.abs(deltaX) / deltaTime

      // 滑动阈值和速度阈值
      var threshold = -this.data.deleteBtnWidth * 0.5 // 50%显示删除按钮
      var velocityThreshold = 0.3

      var targetX = 0
      if (deltaX <= threshold || velocity > velocityThreshold) {
        // 显示删除按钮
        targetX = -this.data.deleteBtnWidth
      }

      this.setData({
        translateX: targetX,
        isSliding: false
      })
    },

    // 重置滑动状态（供父组件调用）
    resetSwipe() {
      this.setData({
        translateX: 0,
        isSliding: false
      })
    }
  }
})