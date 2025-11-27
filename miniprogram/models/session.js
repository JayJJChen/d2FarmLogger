"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStatus = exports.SessionTargetType = void 0;
exports.createSession = createSession;
// Session Goal Type
var SessionTargetType;
(function (SessionTargetType) {
    SessionTargetType["RunCount"] = "count";
    SessionTargetType["Time"] = "time";
    SessionTargetType["None"] = "none"; // Just start
})(SessionTargetType || (exports.SessionTargetType = SessionTargetType = {}));
// Session Status
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["Active"] = "active";
    SessionStatus["Paused"] = "paused";
    SessionStatus["Completed"] = "completed";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
/**
 * Create a new session object
 */
function createSession(data) {
    var session = {
        id: data.id || '',
        characterId: data.characterId || '',
        characterSnapshot: data.characterSnapshot || { name: '', class: '' },
        sceneIds: data.sceneIds || [],
        sceneSnapshots: data.sceneSnapshots || [],
        target: data.target || { type: SessionTargetType.None },
        status: data.status || SessionStatus.Active,
        startTime: data.startTime || Date.now(),
        duration: data.duration || 0,
        runCount: data.runCount || 0,
        drops: data.drops || [],
        lastUpdate: data.lastUpdate || Date.now()
    };
    if (data.endTime) {
        session.endTime = data.endTime;
    }
    return session;
}
