import { conversationSchema } from "../../schemas/conversations.ts";
import { Conversation, LastMessage, Message, ObjectId } from "../../types/types.js";
import { conversationModel } from "../models/conversations.ts";

export default class ConversationDAO {
  static async getByUserId(id: ObjectId) {
    const conversations = await conversationModel.find({ participants: id });
    return { status: "success", payload: conversations };
  }
  static async getByParticipants(participants: ObjectId[]) {
    const conversation = await conversationModel.find({ participants: { $all: participants } });
    return { status: "success", payload: conversation };
  }
  static async create(conversation: Conversation) {
    const { success, data, error } = conversationSchema.safeParse(conversation);
    if (!success) return { status: "error", error };

    const newConversation = await conversationModel.create(data);
    return { status: "success", payload: newConversation };
  }
  static async replaceLastMessage(participants: ObjectId[], lastMessage: LastMessage) {
    const { success, data, error } = conversationSchema.safeParse({ participants, lastMessage });
    if (!success) return { status: "error", error };
    const newLastConversation = await conversationModel.updateOne({ participants: { $all: data.participants } }, { $set: { lastMessage: data.lastMessage } });
    return { status: "success", payload: newLastConversation };
  }
  static async startConversation(body: Message) {
    const { payload } = await this.getByParticipants([body.author, body.receiver]);
    if (payload.length > 0) return { status: "error", error: "This conversation allready exists" };
    const newConversation: Conversation = {
      participants: [body.author, body.receiver],
      lastMessage: {
        author: body.author,
        content: body.content,
      },
    };
    await this.create(newConversation);
    return { status: "success", payload: "New conversation created" };
  }
}
