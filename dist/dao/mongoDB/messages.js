import { STATUS_TYPES } from "../../utils/status.js";
import { messageModel } from "../models/messages.js";
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
    static async getUserMessagesById(id) {
        try {
            const messages = await messageModel.find({ receiver: id });
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
                return { status: STATUS_TYPES.NOT_FOUND, error: "Message not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: message };
        }
        catch (error) {
            throw error;
        }
    }
}
