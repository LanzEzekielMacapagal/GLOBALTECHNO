const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeAnnouncementReply } = require('./announcement-utils');

test('normalizeAnnouncementReply returns a database-safe reply payload', () => {
  const payload = normalizeAnnouncementReply({
    author: 'Student',
    text: 'Thanks for the update',
    createdAt: '2026-07-24T10:00:00.000Z'
  });

  assert.equal(payload.author, 'Student');
  assert.equal(payload.text, 'Thanks for the update');
  assert.ok(payload.createdAt instanceof Date || typeof payload.createdAt === 'string');
  assert.ok(payload._id);
});
