import { UpdateWriteOpResult } from "mongoose";
import { conversationSchema } from "../../schemas/conversations.ts";
import { PersistResult } from "../../types/DAO.js";
import { Conversation, LastMessage, Message, ObjectId } from "../../types/types.js";
import { conversationModel } from "../models/conversations.ts";
import { STATUSES } from "../../types/enums.js";

export default class ConversationDAO {
  static async getAllByUserId(id: ObjectId): Promise<PersistResult<Conversation>> {
    const conversations = await conversationModel.find({ participants: id }).lean<Conversation>();
    return { status: STATUSES.SUCCESS, payload: conversations };
  }
  static async getByParticipants(participants: ObjectId[]): Promise<PersistResult<Conversation>> {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } }).lean<Conversation>();
    if (!conversation) return { status: STATUSES.ERROR, error: "Conversation not found" };
    return { status: STATUSES.SUCCESS, payload: conversation };
  }
  static async create(conversation: Conversation): Promise<PersistResult<Conversation>> {
    const { success, data, error } = conversationSchema.safeParse(conversation);
    if (!success) return { status: STATUSES.ERROR, error };

    await conversationModel.create(data);
    return { status: STATUSES.SUCCESS, payload: conversation };
  }
  static async replaceLastMessage(participants: ObjectId[], lastMessage: LastMessage): Promise<PersistResult<UpdateWriteOpResult>> {
    const { success, data, error } = conversationSchema.safeParse({ participants, lastMessage });
    if (!success) return { status: STATUSES.ERROR, error };
    const newLastConversation = await conversationModel.updateOne({ participants: { $all: data.participants } }, { $set: { lastMessage: data.lastMessage } });
    return { status: STATUSES.SUCCESS, payload: newLastConversation };
  }
  static async startConversation(body: Message): Promise<PersistResult<string>> {
    const { status } = await this.getByParticipants([body.author, body.receiver]);
    if (status === STATUSES.ERROR) return { status, error: "This conversation allready exists" };
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      lastMessage: {
        author: body.author,
        content: body.content,
      },
    };
    await this.create(newConversation);
    return { status, payload: "New conversation created" };
  }
}
