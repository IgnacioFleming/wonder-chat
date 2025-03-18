import { Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";
import { toObjectId } from "../../utils/utils.ts";
import { GetMessagesParams, Message } from "../../types/types.js";

export const messagesHandler = (socket: Socket) => {
  socket.on("newMessage", async (message) => {
    const newMessage = await MessageDAO.create(message);
    socket.emit("newMessage", newMessage);
  });

  socket.on("getMessages", async ({ userId, contactId }: GetMessagesParams) => {
    const userObjectId = toObjectId(userId);
    const contactObjectId = toObjectId(contactId);
    const messages = await MessageDAO.getUserMessagesById(userObjectId, contactObjectId);
    socket.emit("getMessages", messages);
  });

  socket.on("markRead", async ({ _id }) => {
    await MessageDAO.markRead(_id);
  });

  socket.on("sendMessage", async ({ author, content, receiver }: Message) => {
    const newMessage = await MessageDAO.create({ author, content, receiver });
    socket.emit("sendMessage", newMessage);
  });
};
