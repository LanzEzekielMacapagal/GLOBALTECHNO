const test = require('node:test');
const assert = require('node:assert/strict');

const { buildPrivateMessageFilter, buildPrivateMessagePayload, buildCourseLookupFilter, buildUserLookupFilter } = require('./chat-utils');

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

test('buildCourseLookupFilter safely handles non-ObjectId classroom values', () => {
  const invalidIdFilter = buildCourseLookupFilter('not-a-valid-id');
  const validIdFilter = buildCourseLookupFilter('507f1f77bcf86cd799439011');

  assert.deepEqual(invalidIdFilter, {
    $or: [{ id: 'not-a-valid-id' }, { invitationCode: 'not-a-valid-id' }],
  });

  assert.deepEqual(validIdFilter.$or[0], { _id: '507f1f77bcf86cd799439011' });
  assert.equal(validIdFilter.$or[1].id, '507f1f77bcf86cd799439011');
  assert.equal(validIdFilter.$or[2].invitationCode, '507f1f77bcf86cd799439011');
});

test('buildUserLookupFilter resolves a user by id or username safely', () => {
  const invalidUserFilter = buildUserLookupFilter('student-name');
  const validUserFilter = buildUserLookupFilter('507f1f77bcf86cd799439011');

  assert.deepEqual(invalidUserFilter, {
    $or: [{ username: 'student-name' }, { email: 'student-name' }],
  });

  assert.deepEqual(validUserFilter.$or[0], { _id: '507f1f77bcf86cd799439011' });
  assert.equal(validUserFilter.$or[1].username, '507f1f77bcf86cd799439011');
  assert.equal(validUserFilter.$or[2].email, '507f1f77bcf86cd799439011');
});
