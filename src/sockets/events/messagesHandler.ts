import type { GetMessagesParams } from "../../types/types.d.ts";
import type { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.d.ts";
import { Server, Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";
import { userSocketMap } from "../SocketManager.ts";
import { STATUSES } from "../../types/enums.js";
import ConversationDAO from "../../dao/mongoDB/conversations.ts";

export const messagesHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, socketServer: Server<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on("newMessage", async (message) => {
    message.status = "sent";
    const newMessage = await MessageDAO.create(message);
    if (newMessage.status === STATUSES.SUCCESS) {
      const result = await ConversationDAO.updateConversation({ ...message, _id: newMessage.payload?._id });
      if (result.status === STATUSES.SUCCESS) socket.emit("sendConversation", { payload: result.payload });
      socket.emit("sendMessage", newMessage.payload);
      const receiverSocketId = userSocketMap.get(message.receiver.toString());
      if (receiverSocketId) {
        socketServer.to(receiverSocketId).emit("sendMessage", newMessage.payload);
        const authorSocketId = userSocketMap.get(message.author.toString());
        if (authorSocketId) {
          await MessageDAO.markAllAsReceived(message.receiver);
          socketServer.to(authorSocketId).emit("updateMessageStatus", { message: newMessage.payload, status: "received" });
        }
      }
    }
  });

  socket.on("getMessages", async ({ userId, contactId }: GetMessagesParams) => {
    const result = await MessageDAO.getUserMessagesById(userId, contactId);
    if (result.status === STATUSES.ERROR) return;
    socket.emit("sendMessages", result.payload);
  });

  socket.on("markAllMessagesAsReceived", async ({ userId }) => {
    const updatedMessages = await MessageDAO.markAllAsReceived(userId);
    if (updatedMessages.status !== STATUSES.SUCCESS) return;
    updatedMessages.payload.forEach((msg) => {
      const authorId = msg.author.toString();
      const receiverSocket = userSocketMap.get(authorId);
      if (receiverSocket) {
        socketServer.to(receiverSocket).emit("updateMessageStatus", { message: msg, status: "received" });
      }
    });
  });
  socket.on("updateMessagesToRead", async ({ userId, contactId }) => {
    const updatedMessages = await MessageDAO.markAllAsRead(userId, contactId);
    if (updatedMessages.status !== STATUSES.SUCCESS) return;
    updatedMessages.payload.forEach((msg) => {
      const authorId = msg.author.toString();
      const receiverSocket = userSocketMap.get(authorId);
      if (receiverSocket) {
        socketServer.to(receiverSocket).emit("updateMessageStatus", { message: msg, status: "read" });
      }
    });
  });
};
