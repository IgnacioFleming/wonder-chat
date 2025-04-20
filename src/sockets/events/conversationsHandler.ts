import { Socket } from "socket.io";
import ConversationDAO from "../../dao/mongoDB/conversations.ts";

export const conversationsHandler = (socket: Socket) => {
  socket.on("getConversations", async ({ userId }) => {
    const conversations = await ConversationDAO.getAllByUserId(userId);
    socket.emit("sendConversations", conversations);
  });
};
