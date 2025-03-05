import { Server } from "socket.io";
import http from "http";

export default class MessageService {
  private socketServer;
  server = http.createServer();
  constructor() {
    this.socketServer = new Server(this.server);
  }
  async enable(): Promise<void> {
    this.socketServer.on("connection", () => {
      console.log("Connection ON");
    });
  }
}
