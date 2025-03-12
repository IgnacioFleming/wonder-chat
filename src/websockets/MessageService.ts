import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import MessageDAO from "../dao/mongoDB/messages.ts";
import { ServerToClientEvents } from "../types/websockets.js";

export default class MessageService {
  private socketServer: Server;
  constructor(server: HttpServer) {
    this.socketServer = new Server<ServerToClientEvents>(server);
  }
  async enable(): Promise<void> {
    this.socketServer.on("connection", async (socket) => {
      console.log("Connection ON");
      socket.on("newMessage", async (message) => {
        await MessageDAO.create(message);
        socket.emit("confirmNewMessage", { status: "success" });
      });
      socket.on("getMessages", async ({ user }) => {
        const messages = await MessageDAO.getUserMessagesById(user);
        socket.emit("myMessages", messages);
      });

      socket.on("disconnect", () => console.log("connection closed"));
    });
  }
}
