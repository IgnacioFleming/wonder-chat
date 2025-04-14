import { ClientMessage, PopulatedConversation } from "../../types/types.js";
import helpers from "./helpers.ts";
import { getContacts } from "./services/contacts.ts";
import { GlobalState } from "./store.ts";

declare global {
  interface Window {
    io: any;
  }
}

if (!GlobalState.user || !GlobalState.user._id) window.location.href = "/login";
const userId = GlobalState.user?._id;
let contactId = GlobalState.selectedContact?._id;

//key elements
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;
export const allContactsSection = document.getElementById("contacts") as HTMLElement;
const contactsList = document.getElementById("contacts-list") as HTMLDivElement;
const newMessageBtn = document.getElementById("new-message-btn") as HTMLElement;
const closeContactsBtn = document.getElementById("close-contacts") as HTMLElement;

//socket events

const socket = window.io();

socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }: { payload: PopulatedConversation[] }) => {
  const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
  helpers.renderListOfContacts(socket, conversationsContainer, payload);
});

socket.on("sendMessage", (message: ClientMessage) => {
  if (!userId) return;
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  helpers.renderSingleMessage(message, userId.toString(), messagesSection);
  messagesSection.scrollTop = messagesSection.scrollHeight;
});

//event listeners

newMessageInput.addEventListener("keydown", (e) => helpers.sendMessage(e, socket, newMessageInput));
newMessageBtn.addEventListener("click", async () => {
  if (!userId) return;
  const contacts = await getContacts(userId);
  allContactsSection.classList.replace("hidden", "block");
  if (!contacts || contacts?.length <= 0) return;
  helpers.renderListOfContacts(socket, contactsList, contacts);
});

closeContactsBtn.addEventListener("click", helpers.closeContactsList);
