import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export default class MessageService {
  private socketServer: Server;
  constructor(server: HttpServer) {
    this.socketServer = new Server(server);
  }
  async enable(): Promise<void> {
    this.socketServer.on("connection", () => {
      console.log("Connection ON");
    });
  }
}
