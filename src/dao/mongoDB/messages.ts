import { ObjectId } from "mongoose";
import type { Message } from "../../types/types.d.ts";
import { STATUS_TYPES } from "../../utils/status.ts";
import { messageModel } from "../models/messages.ts";
import ConversationDAO from "./conversations.ts";

export default class MessageDAO {
  static async getAll() {
    try {
      const messages = await messageModel.find();
      if (!messages) return { status: STATUS_TYPES.NOT_FOUND, error: "Messages not found." };
      return { status: STATUS_TYPES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async getById(id: ObjectId) {
    try {
      const message = await messageModel.findById(id);
      if (!message?.id) return { status: STATUS_TYPES.NOT_FOUND, error: "Message not found." };
      return { status: STATUS_TYPES.SUCCESS, payload: message };
    } catch (error) {
      throw error;
    }
  }
  static async getUserMessagesById(id: ObjectId) {
    try {
      const messages = await messageModel.find({ receiver: id });
      return { status: STATUS_TYPES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async create(body: Message) {
    try {
      const message = await messageModel.create(body);
      if (!message?.id) return { status: STATUS_TYPES.ERROR, error: "Message could not been created" };
      await ConversationDAO.replaceLastMessage([body.author, body.receiver], { author: body.author, content: body.content });
      return { status: STATUS_TYPES.SUCCESS, payload: message };
    } catch (error) {
      throw error;
    }
  }
  static async markRead(id: ObjectId) {
    const update = await messageModel.updateOne({ _id: id }, { $set: { isRead: true } });
    return { status: "success", payload: update };
  }
}
