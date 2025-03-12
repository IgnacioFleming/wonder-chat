import { ObjectId } from "../../types/types.js";
import { conversationModel } from "../models/conversations.ts";

export default class ConversationDAO {
  static async getByUserId(id: ObjectId) {
    // const conversations = await conversationModel.find({ $or: [{ author: id }, { receiver: id }] });
    return { status: "success", payload: conversations };
  }
}
