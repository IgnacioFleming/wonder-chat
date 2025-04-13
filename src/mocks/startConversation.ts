import mongoose from "mongoose";
import config from "../config/config.ts";
import { Message } from "../types/types.js";
import ConversationDAO from "../dao/mongoDB/conversations.ts";

console.log("Mock Conversation creation");
mongoose.connect(config.mongo_url_dev);
const message: Message = {
  author: new mongoose.Types.ObjectId("67ddae8bcdae937677019c6b"),
  receiver: new mongoose.Types.ObjectId("67ddb741bf46ad8bb7c5184c"),
  content: "this is a mock message",
};
const result = await ConversationDAO.startConversation(message);
console.log(result);
process.exit(0);
