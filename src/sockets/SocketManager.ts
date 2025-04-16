import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/websockets.d.ts";
import { messagesHandler } from "./events/messagesHandler.ts";
import { conversationsHandler } from "./events/conversationsHandler.ts";
import UserDAO from "../dao/mongoDB/users.ts";
import { GeneralId } from "../types/types.js";

export const userSocketMap = new Map<string, string>();
export default class SocketManager {
  private socketServer: Server<ClientToServerEvents, ServerToClientEvents>;
  constructor(server: HttpServer) {
    this.socketServer = new Server(server);
  }

  getSocketServer(): Server {
    return this.socketServer;
  }

  connect() {
    this.socketServer.on("connection", (socket) => {
      socket.on("register", async (userId: string) => {
        userSocketMap.set(userId, socket.id);
        const result = await UserDAO.updateLastConnection(userId, "online");
        socket.broadcast.emit("notifyConnection", result.payload);
        console.log(`User ${userId} conectado con socket ${socket.id}`);
      });
      messagesHandler(socket, this.socketServer);
      conversationsHandler(socket);
      socket.on("disconnect", async () => {
        for (const [userId, id] of userSocketMap.entries()) {
          if (id === socket.id) {
            await UserDAO.updateLastConnection(userId, "offline");
            return userSocketMap.delete(userId);
          }
        }
      });
    });
  }
}
