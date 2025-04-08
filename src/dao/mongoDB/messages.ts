import { UpdateWriteOpResult } from "mongoose";
import { PersistResult } from "../../types/DAO.js";
import type { Message, MessageWithId, GeneralId } from "../../types/types.d.ts";
import { messageModel } from "../models/messages.ts";
import { STATUSES } from "../../types/enums.js";
import { MSG_STATUS } from "../../types/consts.ts";

export default class MessageDAO {
  static async getAll(): Promise<PersistResult<Message[]>> {
    try {
      const messages = await messageModel.find().lean<Message[]>();
      return { status: STATUSES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async getById(id: GeneralId): Promise<PersistResult<Message>> {
    try {
      const message = await messageModel.findById(id).lean<Message>();
      if (!message?.author) return { status: STATUSES.ERROR, error: "Message not found." };
      return { status: STATUSES.SUCCESS, payload: message };
    } catch (error) {
      throw error;
    }
  }
  static async getUserMessagesById(userId: GeneralId, contactId: GeneralId): Promise<PersistResult<MessageWithId[]>> {
    try {
      const messages = await messageModel
        .find({
          $or: [{ $and: [{ author: userId }, { receiver: contactId }] }, { $and: [{ author: contactId }, { receiver: userId }] }],
        })
        .lean<MessageWithId[]>();
      return { status: STATUSES.SUCCESS, payload: messages };
    } catch (error) {
      throw error;
    }
  }
  static async create(body: Message): Promise<PersistResult<MessageWithId>> {
    try {
      const message = await messageModel.create(body);
      if (!message?.id) return { status: STATUSES.ERROR, error: "Message could not been created" };
      return { status: STATUSES.SUCCESS, payload: { ...body, _id: message.id } };
    } catch (error) {
      throw error;
    }
  }
  static async markAllAsReceived(userId: GeneralId): Promise<PersistResult<MessageWithId[]>> {
    const messages = await messageModel.find({ receiver: userId, status: MSG_STATUS.SENT }).lean<MessageWithId[]>();
    const messageIds = messages.map((msg) => msg._id);
    await messageModel.updateMany({ _id: { $in: messageIds } }, { $set: { status: MSG_STATUS.RECEIVED } });
    return { status: STATUSES.SUCCESS, payload: messages };
  }
  static async markAllAsRead(userId: GeneralId, contactId: GeneralId): Promise<PersistResult<MessageWithId[]>> {
    console.log("userId ", userId);
    console.log("contactId ", contactId);
    const messages = await messageModel.find({ status: MSG_STATUS.RECEIVED, author: contactId, receiver: userId }).lean<MessageWithId[]>();
    console.log("estos son los mensajes recuperados por el dao", messages);
    const messageIds = messages.map((msg) => msg._id);
    await messageModel.updateMany({ _id: { $in: messageIds } }, { $set: { status: MSG_STATUS.READ } });
    return { status: STATUSES.SUCCESS, payload: messages };
  }
}
