import mongoose from "mongoose";
import MessageDAO from "../dao/mongoDB/messages.ts";
import { Message } from "../types/types.js";
import config from "../config/config.ts";

console.log("Mock Message creation");
mongoose.connect(config.mongo_url_dev);
const message: Message = {
  author: new mongoose.Types.ObjectId(),
  receiver: new mongoose.Types.ObjectId(),
  content: "this is a mock message",
};
await MessageDAO.create(message);
