import { messageModel } from "../models/messages.js";
export default class MessageDAO {
    static async getAll() {
        try {
            const messages = await messageModel.find().lean();
            return { status: "success" /* STATUSES.SUCCESS */, payload: messages };
        }
        catch (error) {
            throw error;
        }
    }
    static async getById(id) {
        try {
            const message = await messageModel.findById(id).lean();
            if (!message?.author)
                return { status: "error" /* STATUSES.ERROR */, error: "Message not found." };
            return { status: "success" /* STATUSES.SUCCESS */, payload: message };
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserMessagesById(userId, contactId) {
        try {
            const messages = await messageModel
                .find({
                $or: [{ $and: [{ author: userId }, { receiver: contactId }] }, { $and: [{ author: contactId }, { receiver: userId }] }],
            })
                .lean();
            return { status: "success" /* STATUSES.SUCCESS */, payload: messages };
        }
        catch (error) {
            throw error;
        }
    }
    static async create(body) {
        try {
            const message = await messageModel.create(body);
            if (!message?.id)
                return { status: "error" /* STATUSES.ERROR */, error: "Message could not been created" };
            // const result = await ConversationDAO.replaceLastMessage([body.author, body.receiver], body.content);
            return { status: "success" /* STATUSES.SUCCESS */, payload: body };
        }
        catch (error) {
            throw error;
        }
    }
    static async markRead(id) {
        const update = await messageModel.updateOne({ _id: id }, { $set: { isRead: true } });
        return { status: "success" /* STATUSES.SUCCESS */, payload: update };
    }
}
