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
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;
const allContactsSection = document.getElementById("contacts") as HTMLElement;
const contactsList = document.getElementById("contacts-list") as HTMLDivElement;
const newMessageBtn = document.getElementById("new-message-btn") as HTMLElement;
const closeContactsBtn = document.getElementById("close-contacts") as HTMLElement;

const socket = window.io();

socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }: { payload: PopulatedConversation[] }) => {
  const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
  helpers.renderListOfContacts(socket, conversationsContainer, payload);
});

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
newMessageBtn.addEventListener("click", async () => {
  if (!userId) return;
  const contacts = await getContacts(userId);
  console.log(contacts);
  allContactsSection.classList.replace("hidden", "block");
  if (!contacts || contacts?.length <= 0) return;
  helpers.renderListOfContacts(socket, contactsList, contacts);
});

closeContactsBtn.addEventListener("click", () => {
  allContactsSection.classList.add("close");
  setTimeout(() => {
    allContactsSection.classList.replace("block", "hidden");
    allContactsSection.classList.remove("close");
  }, 290);
});
