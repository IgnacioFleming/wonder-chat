import { conversationSchema } from "../../schemas/conversations.ts";
import { PersistResult } from "../../types/DAO.js";
import { Conversation, GeneralId, PopulatedConversation, PopulatedConversationWithId, MessageStatus, MessageWithId, ConversationWithId } from "../../types/types.js";
import { conversationModel } from "../models/conversations.ts";
import { STATUSES } from "../../types/enums.js";

export default class ConversationDAO {
  static async getAllByUserId(id: GeneralId): Promise<PersistResult<PopulatedConversation>> {
    const conversations = await conversationModel.find({ participants: id }).populate("participants").lean<PopulatedConversation>();
    return { status: STATUSES.SUCCESS, payload: conversations };
  }
  static async getByParticipants(participants: GeneralId[]): Promise<PersistResult<ConversationWithId>> {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } }).lean<ConversationWithId>();
    if (!conversation) return { status: STATUSES.ERROR, error: "Conversation not found" };
    return { status: STATUSES.SUCCESS, payload: conversation };
  }
  static async create(conversation: Conversation): Promise<PersistResult<ConversationWithId>> {
    const { success, data, error } = conversationSchema.safeParse(conversation);
    if (!success) return { status: STATUSES.ERROR, error };
    const result = await conversationModel.create(data);
    return { status: STATUSES.SUCCESS, payload: { ...conversation, _id: result.id } };
  }
  static async replaceLastMessage(params: { participants: GeneralId[]; author: GeneralId; lastMessageContent: string; lastMessageId: GeneralId; status: MessageStatus; unreadMessages: number }): Promise<PersistResult<Conversation>> {
    const replacedConversation = { lastMessage: params.lastMessageContent, date: new Date(), lastMessageId: params.lastMessageId, status: params.status, author: params.author, unreadMessages: params.unreadMessages };
    await conversationModel.updateOne({ participants: { $all: params.participants } }, { $set: replacedConversation });
    return { status: STATUSES.SUCCESS, payload: { ...replacedConversation, participants: params.participants } };
  }
  static async updateConversation(body: MessageWithId): Promise<PersistResult<PopulatedConversationWithId>> {
    const { status, payload } = await this.getByParticipants([body.author, body.receiver]);
    if (status === STATUSES.SUCCESS) {
      const replacedlastMessage = await this.replaceLastMessage({ participants: [body.author, body.receiver], author: body.author, lastMessageContent: body.content, lastMessageId: body._id, status: body.status || "sent", unreadMessages: payload.unreadMessages ? payload.unreadMessages + 1 : 1 });
      if (replacedlastMessage.status === STATUSES.SUCCESS) {
        return { status: STATUSES.SUCCESS, payload: await new conversationModel({ ...replacedlastMessage.payload, _id: payload._id }).populate("participants") };
      }
    }
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      author: body.author,
      lastMessage: body.content,
      lastMessageId: body._id,
      unreadMessages: 1,
    };
    const result = await this.create(newConversation);
    if (result.status !== STATUSES.SUCCESS) return { status: result.status, error: result.error || "There was an error during the process" };
    const populatedConversation = new conversationModel(result.payload);
    return { status: STATUSES.SUCCESS, payload: await populatedConversation.populate("participants") };
  }

  static async exists(participants: GeneralId[]): Promise<boolean> {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } }).lean<Conversation>();
    return !!conversation;
  }
}
