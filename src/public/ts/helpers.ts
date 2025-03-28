import { Socket } from "socket.io";
import { ClientMessage, UserWithId } from "../../types/types.js";

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
  socket.emit("newMessage", message);
};

const renderConversationHeader = ({ full_name, photo }: Pick<UserWithId, "full_name" | "photo">) => {
  const headerSection = document.querySelector(".conversation header") as HTMLElement;
  headerSection.classList.add("hasMessages");
  headerSection.innerHTML = `
   <div class="list-item">
      <img class="avatar" src="${photo || "/images/avatar1.png"}" alt="photo" />
      <p>${full_name}</p>
    </div>
    <i class="bi bi-search pointer" style="font-size: 20px;"></i>
    <i class="bi bi-three-dots-vertical pointer" style="font-size: 24px;"></i>
  `;
};

export default { renderMessages, renderSingleMessage, renderConversationHeader, sendMessage };
