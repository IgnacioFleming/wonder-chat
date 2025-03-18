import { Socket } from "socket.io";
import { ClientMessage } from "../../types/types.js";

const renderMessages = (messages: ClientMessage[], senderId: string) => {
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  messages.forEach((message) => renderSingleMessage(message, senderId, messagesSection));
};

const renderSingleMessage = (message: ClientMessage, senderId: string, target: HTMLElement) => {
  const paragraph = document.createElement("p");
  paragraph.innerText = message.content;
  paragraph.className = "message";
  if (message.author === senderId) paragraph.classList.add("sent");
  target.appendChild(paragraph);
};

const sendMessage = async (socket: Socket, message: ClientMessage) => {
  socket.emit("sendMessage", message);
};

export default { renderMessages, renderSingleMessage, sendMessage };
