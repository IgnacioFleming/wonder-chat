import { Server } from "socket.io";
import http from "http";
export default class MessageService {
    socketServer;
    server = http.createServer();
    constructor() {
        this.socketServer = new Server(this.server);
    }
    async enable() {
        this.socketServer.on("connection", () => {
            console.log("Connection ON");
        });
    }
}
