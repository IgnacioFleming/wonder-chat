import { Server } from "socket.io";
import type http from "http";

export default class MessageService {
  private socketServer;
  constructor(server: http.Server) {
    this.socketServer = new Server(server);
  }
}
