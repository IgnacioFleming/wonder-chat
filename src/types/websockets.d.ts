import { Message } from "./types.js";

interface ServerToClientEvents {
  sendMessages: Message[];
}

interface ClientToServerEvents {
  newMessage: Message;
}
