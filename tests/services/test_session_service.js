require('../utils/mock-wx');
const { SessionStorageService } = require('../../build/services/sessionStorageService');
const { createSession, SessionStatus } = require('../../build/models/session');

console.log('=== Testing SessionStorageService ===');

wx.clearStorageSync();

// Test Create
const session = createSession({
    id: 'test_1',
    characterId: 'char_1',
    characterSnapshot: { name: 'TestChar', class: 'Sorceress' },
    status: SessionStatus.Active
});

// Test Save Current
SessionStorageService.saveCurrentSession(session);
const loaded = SessionStorageService.getCurrentSession();
if (loaded && loaded.id === 'test_1') {
    console.log('PASS: Save Current Session');
} else {
    console.error('FAIL: Save Current Session');
    process.exit(1);
}

// Test Archive
SessionStorageService.archiveSession(session);
const current = SessionStorageService.getCurrentSession();
const history = SessionStorageService.getHistory();

if (current === null && history.length === 1 && history[0].id === 'test_1') {
    console.log('PASS: Archive Session');
} else {
    console.error('FAIL: Archive Session');
    process.exit(1);
}
