import mongoose from "mongoose";
const messagesCollection = "messages";
const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    date: {
        type: String,
        default: Date(),
    },
    isSent: {
        type: Boolean,
        default: false,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});
export const messageModel = mongoose.model(messagesCollection, messageSchema);
