import type { GetMessagesParams, Message, ObjectId } from "../../types/types.d.ts";
import type { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.d.ts";
import { Server, Socket } from "socket.io";
import MessageDAO from "../../dao/mongoDB/messages.ts";
import { userSocketMap } from "../SocketManager.ts";
import { toObjectId } from "../../utils/utils.ts";
import { STATUSES } from "../../types/enums.js";

export const messagesHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, socketServer: Server<ServerToClientEvents>) => {
  socket.on("newMessage", async (message: Message) => {
    await MessageDAO.create(message);
    socket.emit("sendMessage", message);
    const receiverSocketId = userSocketMap.get(message.receiver.toString());

    if (receiverSocketId) {
      socketServer.to(receiverSocketId).emit("sendMessage", message);
    }
  });

  socket.on("getMessages", async ({ userId, contactId }: GetMessagesParams) => {
    const userObjectId = toObjectId(userId);
    const contactObjectId = toObjectId(contactId);
    const result = await MessageDAO.getUserMessagesById(userObjectId, contactObjectId);
    if (result.status === STATUSES.ERROR) return;
    socket.emit("sendMessages", result.payload);
  });

  socket.on("markRead", async ({ _id }: { _id: ObjectId }) => {
    await MessageDAO.markRead(_id);
  });
};
