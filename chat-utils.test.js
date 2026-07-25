const test = require('node:test');
const assert = require('node:assert/strict');

const { buildPrivateMessageFilter, buildPrivateMessagePayload } = require('./chat-utils');

test('buildPrivateMessageFilter uses classroom conversation filters', () => {
  const filter = buildPrivateMessageFilter({
    classroom: 'course-123',
    conversationType: 'classroom',
    conversationId: 'course-123',
  });

  assert.deepEqual(filter, {
    classroom: 'course-123',
    conversationType: 'classroom',
    conversationId: 'course-123',
  });
});

test('buildPrivateMessagePayload stores classroom chat metadata for attachments', () => {
  const payload = buildPrivateMessagePayload({
    sender: 'Admin',
    receiver: 'student-1',
    senderRole: 'admin',
    role: 'admin',
    author: 'Admin',
    studentId: '',
    classroom: 'course-123',
    conversationType: 'classroom',
    conversationId: 'course-123',
    userId: 'user-1',
    text: 'Welcome',
    attachments: [{ name: 'note.pdf', type: 'application/pdf' }],
  });

  assert.equal(payload.conversationType, 'classroom');
  assert.equal(payload.conversationId, 'course-123');
  assert.equal(payload.classroom, 'course-123');
  assert.equal(payload.studentId, null);
  assert.equal(payload.text, 'Welcome');
  assert.equal(payload.attachments.length, 1);
});
