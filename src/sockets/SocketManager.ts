import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/websockets.d.ts";
import { messagesHandler } from "./events/messagesHandler.ts";
import { conversationsHandler } from "./events/conversationsHandler.ts";

export const userSocketMap = new Map<string, string>();
export default class SocketManager {
  private socketServer: Server<ServerToClientEvents, ClientToServerEvents>;
  constructor(server: HttpServer) {
    this.socketServer = new Server(server);
  }

  getSocketServer(): Server {
    return this.socketServer;
  }

  connect() {
    this.socketServer.on("connection", (socket) => {
      console.log("new connection " + socket.id);
      socket.on("register", (userId: string) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} conectado con socket ${socket.id}`);
      });
      messagesHandler(socket, this.socketServer);
      conversationsHandler(socket);
      socket.on("disconnect", () => {
        for (const [userId, id] of userSocketMap.entries()) {
          if (id === socket.id) return userSocketMap.delete(userId);
        }
      });
    });
  }
}
