const assert = require("assert");
const { parseRemovedAttachmentValues, filterAttachmentsByRemoval } = require("./assignment-attachment-utils");

assert.deepStrictEqual(parseRemovedAttachmentValues("notes.pdf"), ["notes.pdf"]);
assert.deepStrictEqual(parseRemovedAttachmentValues(["notes.pdf", "guide.docx"]), ["notes.pdf", "guide.docx"]);
assert.deepStrictEqual(
  filterAttachmentsByRemoval(
    [
      { name: "notes.pdf", filename: "notes.pdf" },
      { name: "guide.docx", filename: "guide.docx" }
    ],
    ["notes.pdf"]
  ),
  [{ name: "guide.docx", filename: "guide.docx" }]
);

console.log("assignment attachment utility tests passed");
