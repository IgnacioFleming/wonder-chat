import { Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";
import ConversationDAO from "../../dao/mongoDB/conversations.ts";

export const messagesHandler = (socket: Socket) => {
  socket.on("newMessage", async (message) => {
    const newMessage = await MessageDAO.create(message);
    socket.emit("newMessage", newMessage);
  });

  socket.on("getMessages", async ({ user }) => {
    const messages = await MessageDAO.getUserMessagesById(user);
    socket.emit("getMessages", messages);
  });

  socket.on("markRead", async ({ _id }) => {
    await MessageDAO.markRead(_id);
  });
};
