import { ClientMessage, PopulatedConversation, UserWithId } from "../../types/types.js";
import helpers from "./helpers.ts";
import { GlobalState } from "./store.ts";

declare global {
  interface Window {
    io: any;
  }
}

if (!GlobalState.user || !GlobalState.user._id) window.location.href = "/login";
const userId = GlobalState.user?._id;
let contactId = GlobalState.selectedContact?._id;
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;

const socket = window.io();

socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }: { payload: PopulatedConversation[] }) => {
  const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
  payload.forEach((conversation) => {
    const [contact] = conversation.participants.filter((p) => p._id !== userId);
    const conversationDiv = document.createElement("div");
    conversationDiv.classList.add("list-group-item", "list-item", "contact");
    conversationDiv.innerHTML = `
      <img class="avatar" src="${contact.photo || "/images/avatar1.png"}" alt="profile avatar" />
      <div>
          <h3 class="conversation-name">${contact.full_name}</h3>
          <p class="last-message">${conversation.lastMessage.content}</p>
      </div>
          `;
    conversationDiv.addEventListener("click", () => openConversation(contact));
    conversationsContainer.appendChild(conversationDiv);
  });
});
//refactorizar para renderizar los mensajes de acuerdo a un cambio de estado
function openConversation(contact: UserWithId) {
  if (!userId) return;
  GlobalState.selectedContact = contact;
  helpers.renderConversationHeader({ full_name: contact.full_name, photo: contact.photo });
  socket.emit("getMessages", { userId, contactId: contact._id });
  socket.on("sendMessages", (result: ClientMessage[]) => {
    if (result.length > 0) return helpers.renderMessages(result, userId.toString());
  });
  contactId = contact._id;
}

function sendMessage(e: KeyboardEvent) {
  if (!userId) return;
  if (e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  helpers.sendMessage(socket, { author: userId.toString(), receiver: contactId?.toString() || "", content });
  newMessageInput.value = "";
}

socket.on("sendMessage", (message: ClientMessage) => {
  if (!userId) return;
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  helpers.renderSingleMessage(message, userId.toString(), messagesSection);
  messagesSection.scrollTop = messagesSection.scrollHeight;
});

newMessageInput.addEventListener("keydown", sendMessage);
