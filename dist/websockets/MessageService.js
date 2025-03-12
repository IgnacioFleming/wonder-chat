import { Server } from "socket.io";
import MessageDAO from "../dao/mongoDB/messages.js";
export default class MessageService {
    socketServer;
    constructor(server) {
        this.socketServer = new Server(server);
    }
    async enable() {
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
