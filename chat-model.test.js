const assert = require('node:assert/strict');
const test = require('node:test');

const { ChatMessage } = require('./chat-model');

test('ChatMessage schema includes a classroom and createdAt compound index', () => {
  const indexes = ChatMessage.schema.indexes().map((entry) => Object.keys(entry[0]).sort().join(','));
  assert.ok(indexes.some((index) => index === 'classroom,createdAt'));
});
