import { Session, SessionStatus, SessionTargetType } from '../../models/session'
var { SessionStorageService } = require('../../services/sessionStorageService')

Page({
  data: {
    session: null,
    formattedDuration: '00:00:00',
    targetProgress: '',
    showAddDrop: false
  },

  timer: null,

  onLoad: function() {
      this.loadSession()
  },

  onShow: function() {
      this.loadSession()
      this.startTimer()
  },

  onHide: function() {
      this.stopTimer()
  },

  onUnload: function() {
      this.stopTimer()
  },

  loadSession: function() {
      var session = SessionStorageService.getCurrentSession()
      if (!session) {
          wx.showModal({
              title: '无进行中的Session',
              content: '是否开始新Session？',
              showCancel: false,
              success: (res) => {
                  if (res.confirm) {
                      wx.switchTab({ url: '/pages/characters/characters' })
                  }
              }
          })
          return
      }

      this.setData({ session: session })
      this.updateStatusDisplay()
  },

  startTimer: function() {
      if (this.timer) clearInterval(this.timer)

      var that = this
      this.timer = setInterval(function() {
          var session = that.data.session
          if (session && session.status === SessionStatus.Active) {
              session.duration += 1
              that.setData({
                  session: session
              })
              that.updateStatusDisplay()

              if (session.duration % 60 === 0) {
                  SessionStorageService.saveCurrentSession(session)
              }
          }
      }, 1000)
  },

  stopTimer: function() {
      if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
      }
      var session = this.data.session
      if (session) {
          SessionStorageService.saveCurrentSession(session)
      }
  },

  updateStatusDisplay: function() {
      var session = this.data.session
      if (!session) return

      var duration = session.duration
      var hours = Math.floor(duration / 3600)
      var minutes = Math.floor((duration % 3600) / 60)
      var seconds = duration % 60
      var formatted =
          (hours < 10 ? '0' + hours : hours) + ':' +
          (minutes < 10 ? '0' + minutes : minutes) + ':' +
          (seconds < 10 ? '0' + seconds : seconds)

      var targetText = ''
      if (session.target.type === SessionTargetType.RunCount) {
          targetText = 'Run: ' + session.runCount + ' / ' + session.target.value
      } else if (session.target.type === SessionTargetType.Time) {
           var remaining = (session.target.value * 60) - duration
           if (remaining < 0) remaining = 0
           var rMin = Math.floor(remaining / 60)
           var rSec = remaining % 60
           targetText = 'Time Left: ' + rMin + 'm ' + rSec + 's'
      } else {
          targetText = 'Runs: ' + session.runCount
      }

      this.setData({
          formattedDuration: formatted,
          targetProgress: targetText
      })
  },

  onNextRun: function() {
      var session = this.data.session
      if (!session) return

      session.runCount += 1
      session.lastUpdate = Date.now()
      this.setData({ session: session })
      this.updateStatusDisplay()
      SessionStorageService.saveCurrentSession(session)
  },

  onTogglePause: function() {
      var session = this.data.session
      if (!session) return

      if (session.status === SessionStatus.Active) {
          session.status = SessionStatus.Paused
      } else {
          session.status = SessionStatus.Active
      }
      session.lastUpdate = Date.now()

      this.setData({ session: session })
      SessionStorageService.saveCurrentSession(session)
  },

  onEndSession: function() {
      var that = this
      wx.showModal({
          title: '结束 Session',
          content: '确定要结束本次 MF Session 吗？',
          success: function(res) {
              if (res.confirm) {
                  that.stopTimer()
                  var session = that.data.session
                  session.status = SessionStatus.Completed
                  session.endTime = Date.now()

                  if (SessionStorageService.archiveSession(session)) {
                      wx.switchTab({
                          url: '/pages/index/index'
                      })
                  } else {
                      wx.showToast({ title: '保存失败', icon: 'none' })
                  }
              }
          }
      })
  },

  onAddDrop: function() {
      this.setData({ showAddDrop: true })
  },

  onDropAdded: function(e: any) {
      var drop = e.detail.drop
      var session = this.data.session

      // Add to beginning
      var drops = session.drops || []
      drops.unshift(drop)
      session.drops = drops
      session.lastUpdate = Date.now()

      this.setData({
          session: session,
          showAddDrop: false
      })
      SessionStorageService.saveCurrentSession(session)
  },

  onCancelDrop: function() {
      this.setData({ showAddDrop: false })
  }
})
