import { Message } from "../../types/types.js";

declare global {
  interface Window {
    io: any;
  }
}
const socket = window.io();

socket.on("sendMessages", (messages: Message[]) => console.log(messages));
