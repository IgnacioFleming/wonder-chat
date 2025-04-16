import { UpdateWriteOpResult } from "mongoose";
import { PersistResult } from "../../types/DAO.js";
import type { Message, ObjectId } from "../../types/types.d.ts";
import { messageModel } from "../models/messages.ts";
import ConversationDAO from "./conversations.ts";
import { STATUSES } from "../../types/enums.js";

export default class MessageDAO {
  static async getAll(): Promise<PersistResult<Message[]>> {
    try {
      const messages = await messageModel.find().lean<Message[]>();
      return { status: STATUSES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async getById(id: ObjectId): Promise<PersistResult<Message>> {
    try {
      const message = await messageModel.findById(id).lean<Message>();
      if (!message?.author) return { status: STATUSES.ERROR, error: "Message not found." };
      return { status: STATUSES.SUCCESS, payload: message };
    } catch (error) {
      throw error;
    }
  }
  static async getUserMessagesById(userId: ObjectId, contactId: ObjectId): Promise<PersistResult<Message[]>> {
    try {
      const messages = await messageModel
        .find({
          $or: [{ $and: [{ author: userId }, { receiver: contactId }] }, { $and: [{ author: contactId }, { receiver: userId }] }],
        })
        .lean<Message[]>();
      return { status: STATUSES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async create(body: Message): Promise<PersistResult<Message>> {
    try {
      const message = await messageModel.create(body);
      if (!message?.id) return { status: STATUSES.ERROR, error: "Message could not been created" };
      // const result = await ConversationDAO.replaceLastMessage([body.author, body.receiver], body.content);
      return { status: STATUSES.SUCCESS, payload: body };
    } catch (error) {
      throw error;
    }
  }
  static async markRead(id: ObjectId): Promise<PersistResult<UpdateWriteOpResult>> {
    const update = await messageModel.updateOne({ _id: id }, { $set: { isRead: true } });
    return { status: STATUSES.SUCCESS, payload: update };
  }
}
