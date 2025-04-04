import { UpdateWriteOpResult } from "mongoose";
import { conversationSchema } from "../../schemas/conversations.ts";
import { PersistResult } from "../../types/DAO.js";
import { Conversation, Message, ObjectId, PopulatedConversation, PopulatedConversationWithId } from "../../types/types.js";
import { conversationModel } from "../models/conversations.ts";
import { STATUSES } from "../../types/enums.js";

export default class ConversationDAO {
  static async getAllByUserId(id: ObjectId): Promise<PersistResult<PopulatedConversation>> {
    const conversations = await conversationModel.find({ participants: id }).populate("participants").lean<PopulatedConversation>();
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
  static async replaceLastMessage(participants: ObjectId[], lastMessageContent: string): Promise<PersistResult<UpdateWriteOpResult>> {
    const newLastConversation = await conversationModel.updateOne({ participants: { $all: participants } }, { $set: { lastMessage: lastMessageContent, date: new Date() } });
    return { status: STATUSES.SUCCESS, payload: newLastConversation };
  }
  static async updateConversation(body: Message): Promise<PersistResult<PopulatedConversationWithId>> {
    const { status, payload } = await this.getByParticipants([body.author, body.receiver]);
    if (status === STATUSES.SUCCESS) {
      this.replaceLastMessage([body.author, body.receiver], body.content);
      return await new conversationModel(payload).populate("participants");
    }
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      author: body.author,
      lastMessage: body.content,
    };
    const result = await this.create(newConversation);
    if (result.status !== STATUSES.SUCCESS) return { status: result.status, error: result.error || "There was an error during the process" };
    const populatedConversation = new conversationModel(result.payload);
    return { status: STATUSES.SUCCESS, payload: await populatedConversation.populate("participants") };
  }

  static async exists(participants: ObjectId[]): Promise<boolean> {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } }).lean<Conversation>();
    return !!conversation;
  }
}
