import { UpdateWriteOpResult } from "mongoose";
import { conversationSchema } from "../../schemas/conversations.ts";
import { PersistResult } from "../../types/DAO.js";
import { Conversation, LastMessage, Message, ObjectId, PopulatedConversation } from "../../types/types.js";
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
    // const { success, data, error } = conversationSchema.safeParse({ participants, lastMessage });
    // if (!success) return { status: STATUSES.ERROR, error };
    const newLastConversation = await conversationModel.updateOne({ participants: { $all: participants } }, { lastMessage: { $set: { content: lastMessageContent } } });
    return { status: STATUSES.SUCCESS, payload: newLastConversation };
  }
  static async startConversation(body: Message): Promise<PersistResult<PopulatedConversation>> {
    const { status } = await this.getByParticipants([body.author, body.receiver]);
    if (status === STATUSES.SUCCESS) return { status: STATUSES.ERROR, error: "This conversation allready exists" };
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      lastMessage: {
        author: body.author,
        content: body.content,
      },
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
