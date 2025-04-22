import { Socket } from "socket.io";
import { getContacts } from "./services/contacts.ts";
import { globalState } from "./store.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.js";
import renderHandlers from "./helpers/renderHandlers.ts";
import socketEventsHelpers from "./helpers/socketEventsHelpers.ts";
import { sortConversations } from "./helpers/storeHandlers.ts";
import { emojis } from "./assets/emojis.ts";
import { searchHandler } from "./helpers/domHandlers.ts";
import { debounce, formatLastConnectionDate, resizeMessageInput } from "./helpers/utils.ts";
import { filterUnreadConversations } from "./helpers/filters.ts";
import { STATUSES } from "../../types/enums.js";

declare global {
  interface Window {
    io: () => Socket<ServerToClientEvents, ClientToServerEvents>;
  }
}

if (!globalState.user || !globalState.user._id) window.location.href = "/login";

//DOM elements
export const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;
export const allContactsSection = document.getElementById("contacts") as HTMLElement;
const contactsList = document.getElementById("contacts-list") as HTMLDivElement;
const newMessageBtn = document.getElementById("new-message-btn") as HTMLElement;
const closeContactsBtn = document.getElementById("close-contacts") as HTMLElement;
export const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
export const messagesSection = document.querySelector("section.messages") as HTMLElement;
const emojiBtn = document.getElementById("emoji-btn") as HTMLButtonElement;
const emojiPicker = document.getElementById("emoji-picker") as HTMLDivElement;
const searchConversations = document.getElementById("search-conversations") as HTMLDivElement;
export const searchContacts = document.getElementById("search-contacts")?.querySelector("input") as HTMLInputElement;
const sendButton = document.querySelector(".sendButton") as HTMLButtonElement;
const filtersContainer = document.querySelector(".toggles-container") as HTMLDivElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLDivElement;

//close emoji-picker with outside click

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const clickedInsidePicker = emojiPicker.contains(target);
  const clickedInsideInput = newMessageInput.contains(target);
  const clickedEmojiBtn = emojiBtn.contains(target);
  if (!clickedEmojiBtn && !clickedInsideInput && !clickedInsidePicker) {
    emojiPicker.classList.add("scaleOut");
    setTimeout(() => {
      emojiPicker.classList.add("hidden");
      emojiPicker.classList.remove("scaleOut");
    }, 190);
  }
});

//fill emojis
emojis.forEach((emoji) => {
  const span = document.createElement("span");
  span.textContent = emoji;
  span.classList.add("emoji-option", "pointer");
  span.addEventListener("click", () => {
    newMessageInput.value += emoji;
    newMessageInput.focus();
  });
  emojiPicker.appendChild(span);
});

//socket events

const socket = window.io();

// initial emits

if (globalState?.user?._id) {
  socket.emit("register", globalState.user._id.toString());
  socket.emit("getConversations", { userId: globalState.user._id });
  socket.emit("markAllMessagesAsReceived", { userId: globalState.user._id });
}

//listeners

socket.on("sendConversations", ({ payload }) => {
  globalState.conversations = [...payload];
  sortConversations();
  renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
});
socket.on("sendConversation", ({ payload }) => {
  const conversationIndex = globalState.conversations.findIndex((c) => payload._id === c._id);
  if (conversationIndex < 0) globalState.conversations.push(payload);
  else globalState.conversations[conversationIndex] = payload;
  renderHandlers.sortSingleConversation(socket, payload);
});

socket.on("sendMessage", (message) => {
  if (!globalState.user?._id) return;
  if (globalState.selectedContact.contact?._id === message.author || globalState.selectedContact.contact?._id === message.receiver) {
    renderHandlers.renderSingleMessage(message, globalState.user?._id.toString(), messagesSection);
  }
  if (globalState.selectedContact.contact?._id === message.author) {
    const conversationId = globalState.conversations.find((c) => c.lastMessageId === message._id)?._id;
    const badgeElement = document.querySelector(`div[data-conversationid="${conversationId}"] .badge`);
    if (badgeElement) badgeElement.remove();
    if (globalState.user) socket.emit("updateMessagesToRead", { contactId: message.author, userId: globalState.user?._id });
  }
  messagesSection.scrollTo({
    top: messagesSection.scrollHeight,
    behavior: "smooth",
  });
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

socket.on("notifyConnection", ({ is_online, last_connection, userId }) => {
  if (userId !== globalState.selectedContact.contact?._id.toString()) return;
  const label = document.getElementById("last_connection_label");
  if (!label) return;
  if (is_online) return (label.innerText = "online");
  label.innerText = `${formatLastConnectionDate({ is_online, last_connection })}`;
});

//DOM event listeners

newMessageInput.addEventListener("keydown", (e) => {
  socketEventsHelpers.sendMessage(e, socket, newMessageInput);
  resizeMessageInput();
});
newMessageInput.addEventListener("input", () => {
  if (newMessageInput.value.length > 0) sendButton.classList.remove("disabled");
  else sendButton.classList.add("disabled");
  resizeMessageInput();
});
sendButton.addEventListener("click", (e) => {
  socketEventsHelpers.sendMessage(e, socket, newMessageInput);
  resizeMessageInput();
});
newMessageBtn.addEventListener("click", async () => {
  if (!globalState.user?._id) return;
  const contacts = await getContacts(globalState.user?._id);
  allContactsSection.classList.replace("hidden", "block");
  if (!contacts || contacts?.length <= 0) return;
  globalState.contacts = [...contacts];
  renderHandlers.renderListOfContacts(socket, contactsList, contacts);
});

closeContactsBtn.addEventListener("click", renderHandlers.closeContactsList);
emojiBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("scaleOut");
  setTimeout(() => {
    emojiPicker.classList.toggle("hidden");
    emojiPicker.classList.toggle("scaleOut");
  }, 190);
});

searchConversations.addEventListener("keyup", debounce(searchHandler(socket, conversationsContainer, "conversations"), 500));
searchContacts.addEventListener("keyup", debounce(searchHandler(socket, contactsList, "contacts"), 500));

filtersContainer.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  if (!target.matches("input[type='radio']")) return;
  if (target.id === "opt-all") return renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
  if (target.id === "opt-unread") {
    const unreadConversations = filterUnreadConversations();
    return renderHandlers.renderListOfContacts(socket, conversationsContainer, unreadConversations);
  }
});

const handleLogout = () => {
  fetch("/api/sessions/logout", {
    method: "POST",
  })
    .then((res) => res.json())
    .then(({ status }) => status === STATUSES.SUCCESS && (window.location.href = "/login"))
    .catch((err) => console.log(err));
};

logoutBtn.addEventListener("click", handleLogout);
