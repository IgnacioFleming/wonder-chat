import mongoose from "mongoose";

const collection = "conversations";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.SchemaTypes.ObjectId, ref: "users" }],
  lastMessage: { type: String, required: true },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },
  date: { type: Date, default: () => new Date() },
  isRead: { type: Boolean, default: false },
});

export const conversationModel = mongoose.model(collection, conversationSchema);
