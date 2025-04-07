import mongoose from "mongoose";
import { MSG_STATUS } from "../../types/consts.ts";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  receiver: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  date: { type: String, default: () => new Date() },
  status: { type: String, enum: Object.values(MSG_STATUS), default: MSG_STATUS.SENT },
});

export const messageModel = mongoose.model(messagesCollection, messageSchema);
