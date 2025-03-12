import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { ServerToClientEvents } from "../types/websockets.js";
import { messagesHandler } from "./events/messagesHandler.ts";
import { conversationsHandler } from "./events/conversationsHandler.ts";

export default class SocketManager {
  private socketServer: Server<ServerToClientEvents>;
  constructor(server: HttpServer) {
    this.socketServer = new Server<ServerToClientEvents>(server);
  }

  getSocketServer(): Server {
    return this.socketServer;
  }

  connect() {
    this.socketServer.on("connection", (socket) => {
      console.log("new connection " + socket.id);

      messagesHandler(socket);
      conversationsHandler(socket);
      socket.on("disconnect", () => console.log("disconnected client " + socket.id));
    });
  }
}
