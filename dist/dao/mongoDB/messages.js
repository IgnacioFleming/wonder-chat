import { STATUS_TYPES } from "../../utils/status.js";
import { messageModel } from "../models/messages.js";
import ConversationDAO from "./conversations.js";
export default class MessageDAO {
    static async getAll() {
        try {
            const messages = await messageModel.find();
            if (!messages)
                return { status: STATUS_TYPES.NOT_FOUND, error: "Messages not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: messages };
        }
        catch (error) {
            throw error;
        }
    }
    static async getById(id) {
        try {
            const message = await messageModel.findById(id);
            if (!message?.id)
                return { status: STATUS_TYPES.NOT_FOUND, error: "Message not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: message };
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserMessagesById(userId, contactId) {
        console.log("userId ", userId);
        console.log("contactId ", contactId);
        try {
            const messages = await messageModel.find({
                $or: [{ $and: [{ author: userId }, { receiver: contactId }] }, { $and: [{ author: contactId }, { receiver: userId }] }],
            });
            return { status: STATUS_TYPES.SUCCESS, payload: messages };
        }
        catch (error) {
            throw error;
        }
    }
    static async create(body) {
        try {
            const message = await messageModel.create(body);
            if (!message?.id)
                return { status: STATUS_TYPES.ERROR, error: "Message could not been created" };
            await ConversationDAO.replaceLastMessage([body.author, body.receiver], { author: body.author, content: body.content });
            return { status: STATUS_TYPES.SUCCESS, payload: message };
        }
        catch (error) {
            throw error;
        }
    }
    static async markRead(id) {
        const update = await messageModel.updateOne({ _id: id }, { $set: { isRead: true } });
        return { status: "success", payload: update };
    }
}
