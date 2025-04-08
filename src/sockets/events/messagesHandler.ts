import type { GetMessagesParams } from "../../types/types.d.ts";
import type { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.d.ts";
import { Server, Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";
import { userSocketMap } from "../SocketManager.ts";
import { toObjectId } from "../../utils/utils.ts";
import { STATUSES } from "../../types/enums.js";
import ConversationDAO from "../../dao/mongoDB/conversations.ts";

export const messagesHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, socketServer: Server<ClientToServerEvents, ServerToClientEvents>) => {
  //revisar por que no estoy recibiendo el update
  socket.on("newMessage", async (message) => {
    const result = await ConversationDAO.updateConversation(message);
    if (result.status === STATUSES.SUCCESS) socket.emit("sendConversation", { payload: result.payload });
    message.status = "sent";
    const newMessage = await MessageDAO.create(message);
    if (newMessage.status === STATUSES.SUCCESS) {
      socket.emit("sendMessage", newMessage.payload);
      const receiverSocketId = userSocketMap.get(message.receiver.toString());
      if (receiverSocketId) {
        socketServer.to(receiverSocketId).emit("sendMessage", newMessage.payload);
        const authorSocketId = userSocketMap.get(message.author.toString());
        if (authorSocketId) socketServer.to(authorSocketId).emit("updateMessageStatus", { messageId: String(newMessage.payload._id), status: "received" });
      }
    }
  });

  socket.on("getMessages", async ({ userId, contactId }: GetMessagesParams) => {
    const userObjectId = toObjectId(userId);
    const contactObjectId = toObjectId(contactId);
    const result = await MessageDAO.getUserMessagesById(userObjectId, contactObjectId);
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
        socketServer.to(receiverSocket).emit("updateMessageStatus", { messageId: msg._id.toString(), status: "received" });
      }
    });
  });
};
