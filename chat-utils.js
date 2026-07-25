function buildPrivateMessageFilter(options = {}) {
  const filter = {};
  const conversationType = String(options.conversationType || "private").trim();
  const conversationId = String(options.conversationId || "").trim();
  const classroom = String(options.classroom || "").trim();
  const studentId = String(options.studentId || "").trim();

  if (conversationType === "classroom") {
    if (classroom) filter.classroom = classroom;
    if (conversationId) filter.conversationId = conversationId;
    filter.conversationType = conversationType;
    return filter;
  }

  if (studentId) filter.studentId = studentId;
  if (classroom) filter.classroom = classroom;
  if (conversationId) filter.conversationId = conversationId;
  if (conversationType) filter.conversationType = conversationType;
  return filter;
}

function buildPrivateMessagePayload(options = {}) {
  const sender = String(options.sender || options.author || "").trim();
  const receiver = String(options.receiver || options.studentId || "").trim();
  const senderRole = String(options.senderRole || options.role || "student").trim();
  const text = options.text || "";
  const attachments = Array.isArray(options.attachments) ? options.attachments : [];
  const studentId = String(options.studentId || "").trim();
  const classroom = String(options.classroom || "").trim();
  const conversationType = String(options.conversationType || "private").trim();
  const conversationId = String(options.conversationId || "").trim();
  const userId = String(options.userId || "").trim();
  const author = String(options.author || sender || "Student").trim();

  return {
    studentId: studentId || null,
    classroom: classroom || null,
    conversationType: conversationType || "private",
    conversationId: conversationType === "classroom" ? conversationId || classroom || null : conversationId || studentId || null,
    sender,
    receiver: receiver || studentId,
    senderRole,
    role: senderRole,
    author,
    text,
    attachments,
    userId: userId || null,
  };
}

module.exports = {
  buildPrivateMessageFilter,
  buildPrivateMessagePayload,
};
