import { Socket } from "socket.io";
import ConversationDAO from "../../dao/mongoDB/conversations.ts";

export const conversationsHandler = (socket: Socket) => {
  socket.on("getConversations", async ({ userId }) => {
    console.log(userId);
    const conversations = await ConversationDAO.getAllByUserId(userId);
    socket.emit("getConversations", conversations);
  });
  socket.on("startConversation", async (message) => {
    const newConversation = await ConversationDAO.startConversation(message);
    socket.emit("startConversation", newConversation);
  });
};
