import { Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";

export const messagesHandler = (socket: Socket) => {
  socket.on("newMessage", async (message) => {
    await MessageDAO.create(message);
    socket.emit("confirmNewMessage", { status: "success" });
  });
  socket.on("getMessages", async ({ user }) => {
    const messages = await MessageDAO.getUserMessagesById(user);
    socket.emit("myMessages", messages);
  });
};
