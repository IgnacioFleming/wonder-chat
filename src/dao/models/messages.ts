import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  date: {
    type: String,
    default: new Date(),
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

export const messageModel = mongoose.model(messagesCollection, messageSchema);
