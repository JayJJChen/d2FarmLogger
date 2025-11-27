import { Session } from '../models/session'
var StorageUtils = require('../utils/storageUtils')

var STORAGE_KEYS = {
  CURRENT_SESSION: 'd2_farm_logger_current_session',
  HISTORY: 'd2_farm_logger_sessions_history'
}

var SessionStorageService = {

  /**
   * Get the currently active session
   */
  getCurrentSession: function(): Session | null {
    return StorageUtils.safeGetStorage(STORAGE_KEYS.CURRENT_SESSION, null)
  },

  /**
   * Save/Update the current session
   */
  saveCurrentSession: function(session: Session): boolean {
    session.lastUpdate = Date.now()
    return StorageUtils.safeSetStorage(STORAGE_KEYS.CURRENT_SESSION, session)
  },

  /**
   * Remove current session (without archiving)
   */
  clearCurrentSession: function(): boolean {
    return StorageUtils.safeRemoveStorage(STORAGE_KEYS.CURRENT_SESSION)
  },

  /**
   * Archive a session to history and clear current session
   */
  archiveSession: function(session: Session): boolean {
    // 1. Get history
    var history = this.getHistory()
    // 2. Add to history (prepend)
    history.unshift(session)
    // 3. Save history
    var success = StorageUtils.safeSetStorage(STORAGE_KEYS.HISTORY, history)
    // 4. If success, clear current
    if (success) {
      this.clearCurrentSession()
    }
    return success
  },

  /**
   * Get all history sessions
   */
  getHistory: function(): Session[] {
    return StorageUtils.safeGetStorage(STORAGE_KEYS.HISTORY, [])
  },

  /**
   * Update a session in history (e.g. editing a past session)
   */
  updateSessionInHistory: function(session: Session): boolean {
      var history = this.getHistory()
      var index = -1
      for(var i=0; i<history.length; i++) {
          if(history[i].id === session.id) {
              index = i;
              break;
          }
      }
      if (index > -1) {
          history[index] = session
          return StorageUtils.safeSetStorage(STORAGE_KEYS.HISTORY, history)
      }
      return false
  },

  /**
   * Delete a session from history
   */
  deleteSession: function(sessionId: string): boolean {
    var history = this.getHistory()
    var newHistory = history.filter(function(s) {
        return s.id !== sessionId
    })

    if (newHistory.length === history.length) {
        return false // Not found
    }

    return StorageUtils.safeSetStorage(STORAGE_KEYS.HISTORY, newHistory)
  }
}

module.exports = { SessionStorageService, STORAGE_KEYS }
