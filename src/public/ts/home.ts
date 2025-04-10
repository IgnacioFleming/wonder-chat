import { Socket } from "socket.io";
import { getContacts } from "./services/contacts.ts";
import { globalState } from "./store.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.js";
import renderHandlers from "./helpers/renderHandlers.ts";
import socketEventsHelpers from "./helpers/socketEventsHelpers.ts";
import { sortConversations } from "./helpers/storeHandlers.ts";

declare global {
  interface Window {
    io: () => Socket<ServerToClientEvents, ClientToServerEvents>;
  }
}

if (!globalState.user || !globalState.user._id) window.location.href = "/login";

//DOM elements
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;
export const allContactsSection = document.getElementById("contacts") as HTMLElement;
const contactsList = document.getElementById("contacts-list") as HTMLDivElement;
const newMessageBtn = document.getElementById("new-message-btn") as HTMLElement;
const closeContactsBtn = document.getElementById("close-contacts") as HTMLElement;
export const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
export const messagesSection = document.querySelector("section.messages") as HTMLElement;

//DOM event listeners

newMessageInput.addEventListener("keydown", (e) => socketEventsHelpers.sendMessage(e, socket, newMessageInput));
newMessageBtn.addEventListener("click", async () => {
  if (!globalState.user?._id) return;
  const contacts = await getContacts(globalState.user?._id);
  allContactsSection.classList.replace("hidden", "block");
  if (!contacts || contacts?.length <= 0) return;
  renderHandlers.renderListOfContacts(socket, contactsList, contacts);
});

closeContactsBtn.addEventListener("click", renderHandlers.closeContactsList);

//socket events

const socket = window.io();

// initial emits

if (globalState?.user?._id) {
  socket.emit("register", globalState.user._id.toString());
  socket.emit("getConversations", { userId: globalState.user._id });
  socket.emit("markAllMessagesAsReceived", { userId: globalState.user._id });
}

//listeners

//me falta arreglar el sortconversations cuando se envia un mensaje
socket.on("sendConversations", ({ payload }) => {
  console.log("estoy ejecutando sendConversations");
  globalState.conversations = [...payload];
  sortConversations();
  renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
});
socket.on("sendConversation", ({ payload }) => {
  console.log("entro aca");
  const conversationExists = globalState.conversations.some((c) => payload._id === c._id);
  if (!conversationExists) globalState.conversations.push(payload);
  console.log("primer id", globalState.conversations[0]._id);
  sortConversations();
  console.log("segundo  id", globalState.conversations[0]._id);
  renderHandlers.sortSingleConversation(globalState.conversations[0]._id);
});

socket.on("sendMessage", (message) => {
  if (!globalState.user?._id) return;
  if (globalState.selectedContact.contact?._id === message.author || globalState.selectedContact.contact?._id === message.receiver) {
    renderHandlers.renderSingleMessage(message, globalState.user?._id.toString(), messagesSection);
  }
  if (message.author !== globalState.user?._id && message.author === globalState.selectedContact.contact?._id) {
    if (globalState.user) socket.emit("updateMessagesToRead", { contactId: message.author, userId: globalState.user?._id });
  }
  messagesSection.scrollTo({
    top: messagesSection.scrollHeight,
    behavior: "smooth",
  });
  // socket.emit("getConversations", { userId: globalState.user._id });
  // const prevConversationId = globalState.conversations[0]._id.toString();
  // sortConversations();
  // const nextConversationId = globalState.conversations[0]._id.toString();
  // if (prevConversationId !== nextConversationId) renderHandlers.sortSingleConversation(globalState.conversations[0]._id);
});

socket.on("updateMessageStatus", ({ message, status }) => {
  const messageIcon = messagesSection.querySelector(`[data-msgid="${message._id}"]`)?.querySelector("i");
  const conversationIcon = document.querySelector(`i[data-conversationid="${message._id}"]`) as HTMLElement;
  if (status === "received") {
    messageIcon?.classList.replace("bi-check2", "bi-check2-all");
    conversationIcon.classList.replace("bi-check2", "bi-check2-all");
  }
  if (status === "read") {
    messageIcon?.classList.add("msg-read");
    conversationIcon.classList.add("msg-read");
  }
});
