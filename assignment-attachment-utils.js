function parseRemovedAttachmentValues(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
}

function filterAttachmentsByRemoval(attachments = [], removedValues = []) {
  const removedKeys = new Set(parseRemovedAttachmentValues(removedValues));
  return (Array.isArray(attachments) ? attachments : []).filter((attachment) => {
    const key = String(
      attachment?.filename || attachment?.originalname || attachment?.name || attachment?.path || attachment?.url || ""
    ).trim();
    return !removedKeys.has(key);
  });
}

module.exports = {
  parseRemovedAttachmentValues,
  filterAttachmentsByRemoval
};
