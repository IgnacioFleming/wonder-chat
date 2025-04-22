import { UpdateWriteOpResult } from "mongoose";
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
  static async getByParticipants(participants: GeneralId[]): Promise<PersistResult<Conversation>> {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } }).lean<Conversation>();
    if (!conversation) return { status: STATUSES.ERROR, error: "Conversation not found" };
    return { status: STATUSES.SUCCESS, payload: conversation };
  }
  static async create(conversation: Conversation): Promise<PersistResult<ConversationWithId>> {
    const { success, data, error } = conversationSchema.safeParse(conversation);
    if (!success) return { status: STATUSES.ERROR, error };
    const result = await conversationModel.create(data);
    return { status: STATUSES.SUCCESS, payload: { ...conversation, _id: result.id } };
  }
  static async replaceLastMessage(props: { participants: GeneralId[]; author: GeneralId; lastMessageContent: string; lastMessageId: GeneralId; status: MessageStatus }): Promise<PersistResult<UpdateWriteOpResult>> {
    const newLastConversation = await conversationModel.updateOne({ participants: { $all: props.participants } }, { $set: { lastMessage: props.lastMessageContent, date: new Date(), lastMessageId: props.lastMessageId, status: props.status, author: props.author } });
    return { status: STATUSES.SUCCESS, payload: newLastConversation };
  }
  static async updateConversation(body: MessageWithId): Promise<PersistResult<PopulatedConversationWithId>> {
    const { status, payload } = await this.getByParticipants([body.author, body.receiver]);
    if (status === STATUSES.SUCCESS) {
      this.replaceLastMessage({ participants: [body.author, body.receiver], author: body.author, lastMessageContent: body.content, lastMessageId: body._id, status: body.status || "sent" });
      return { status: STATUSES.SUCCESS, payload: await new conversationModel(payload).populate("participants") };
    }
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      author: body.author,
      lastMessage: body.content,
      lastMessageId: body._id,
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
