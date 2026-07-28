const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  classroom: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    default: null,
  },
  sender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
    enum: ["admin", "student"],
  },
  text: String,
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  collection: "chatmessages",
});

const privateMessageSchema = new mongoose.Schema({
  studentId: {
    type: String,
    default: null,
    index: true,
  },
  classroom: {
    type: String,
    default: "",
    index: true,
  },
  conversationType: {
    type: String,
    default: "private",
    enum: ["private", "classroom"],
    index: true,
  },
  conversationId: {
    type: String,
    default: "",
    index: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    default: "",
    index: true,
  },
  senderRole: {
    type: String,
    default: "student",
    enum: ["admin", "student"],
    index: true,
  },
  role: {
    type: String,
    default: "student",
    enum: ["admin", "student"],
  },
  author: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },
  text: {
    type: String,
    default: "",
  },
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
  collection: "private_messages",
});

chatMessageSchema.index({ classroom: 1, createdAt: 1 });
privateMessageSchema.index({ studentId: 1, conversationType: 1, conversationId: 1, createdAt: -1 });
privateMessageSchema.index({ receiver: 1, createdAt: -1 });
privateMessageSchema.index({ classroom: 1, createdAt: -1 });
privateMessageSchema.index({ userId: 1, createdAt: -1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

module.exports = {
  ChatMessage,
  PrivateMessage,
};
