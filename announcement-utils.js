function normalizeAnnouncementReply(reply = {}) {
  const text = String(reply?.text || '').trim();
  const author = String(reply?.author || 'Student').trim() || 'Student';
  const createdAt = reply?.createdAt ? new Date(reply.createdAt) : new Date();

  return {
    _id: reply?._id || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    author,
    text,
    createdAt
  };
}

function normalizeAnnouncementComment(comment = {}) {
  const normalizedReplies = Array.isArray(comment?.replies)
    ? comment.replies.map((reply) => normalizeAnnouncementReply(reply))
    : [];

  return {
    _id: comment?._id || comment?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    announcementId: comment?.announcementId || '',
    author: String(comment?.author || 'Student').trim() || 'Student',
    text: String(comment?.text || '').trim(),
    pinned: Boolean(comment?.pinned),
    replies: normalizedReplies,
    createdAt: comment?.createdAt ? new Date(comment.createdAt) : new Date()
  };
}

module.exports = {
  normalizeAnnouncementComment,
  normalizeAnnouncementReply
};
