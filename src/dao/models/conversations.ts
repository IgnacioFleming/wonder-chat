import mongoose from "mongoose";

const collection = "conversations";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  lastMessage: {
    content: String,
    author: { type: mongoose.Types.ObjectId, ref: "users" },
    date: {
      type: Date,
      default: Date(),
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
});

export const conversationModel = mongoose.model(collection, conversationSchema);
