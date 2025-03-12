import { Server } from "socket.io";
export default class MessageService {
    socketServer;
    constructor(server) {
        this.socketServer = new Server(server);
    }
    async enable() {
        this.socketServer.on("connection", () => {
            console.log("Connection ON");
        });
    }
}
