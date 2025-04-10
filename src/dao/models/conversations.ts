import mongoose from "mongoose";
import { MSG_STATUS } from "../../types/consts.ts";

const collection = "conversations";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.SchemaTypes.ObjectId, ref: "users" }],
  lastMessage: { type: String, required: true },
  lastMessageId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },
  date: { type: Date, default: () => new Date() },
  status: { type: String, enum: Object.values(MSG_STATUS), default: MSG_STATUS.SENT },
});

export const conversationModel = mongoose.model(collection, conversationSchema);
