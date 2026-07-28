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

function sanitizeChatAttachment(attachment = {}) {
  if (!attachment || typeof attachment !== "object") {
    return attachment;
  }

  const sanitized = {
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
  };

  if (attachment.filename) sanitized.filename = attachment.filename;
  if (attachment.originalname) sanitized.originalname = attachment.originalname;
  if (attachment.url) sanitized.url = attachment.url;
  if (attachment.path) sanitized.path = attachment.path;

  return sanitized;
}

function sanitizeChatMessageForResponse(message = {}) {
  if (!message || typeof message !== "object") {
    return message;
  }

  const sanitizedMessage = { ...message };
  if (Array.isArray(sanitizedMessage.attachments)) {
    sanitizedMessage.attachments = sanitizedMessage.attachments.map(sanitizeChatAttachment);
  }

  return sanitizedMessage;
}

function buildCourseLookupFilter(classroom = "") {
  const normalized = String(classroom || "").trim();
  if (!normalized) return {};

  const maybeObjectId = /^[a-fA-F0-9]{24}$/; // Mongo ObjectId / hex string
  if (maybeObjectId.test(normalized)) {
    return {
      $or: [
        { _id: normalized },
        { id: normalized },
        { invitationCode: normalized },
      ],
    };
  }

  return {
    $or: [
      { id: normalized },
      { invitationCode: normalized },
    ],
  };
}

function buildUserLookupFilter(userId = "") {
  const normalized = String(userId || "").trim();
  if (!normalized) return {};

  const maybeObjectId = /^[a-fA-F0-9]{24}$/;
  if (maybeObjectId.test(normalized)) {
    return {
      $or: [
        { _id: normalized },
        { username: normalized },
        { email: normalized },
      ],
    };
  }

  return {
    $or: [
      { username: normalized },
      { email: normalized },
    ],
  };
}

module.exports = {
  buildPrivateMessageFilter,
  buildPrivateMessagePayload,
  sanitizeChatAttachment,
  sanitizeChatMessageForResponse,
  buildCourseLookupFilter,
  buildUserLookupFilter,
};
