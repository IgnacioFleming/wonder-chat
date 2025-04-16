import { getContacts } from "./services/contacts.js";
import { globalState } from "./store.js";
import renderHandlers from "./helpers/renderHandlers.js";
import socketEventsHelpers from "./helpers/socketEventsHelpers.js";
import { sortConversations } from "./helpers/storeHandlers.js";
if (!globalState.user || !globalState.user._id)
    window.location.href = "/login";
//DOM elements
const newMessageInput = document.getElementById("newMessage");
export const allContactsSection = document.getElementById("contacts");
const contactsList = document.getElementById("contacts-list");
const newMessageBtn = document.getElementById("new-message-btn");
const closeContactsBtn = document.getElementById("close-contacts");
const conversationsContainer = document.querySelector(".conversations");
const messagesSection = document.querySelector("section.messages");
//socket events
const socket = window.io();
if (globalState?.user?._id) {
    socket.emit("register", globalState.user?._id?.toString());
    socket.emit("getConversations", { userId: globalState.user._id });
}
socket.on("sendConversations", ({ payload }) => {
    globalState.conversations = [...payload];
    sortConversations();
    renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
});
socket.on("sendConversation", ({ payload }) => {
    const conversationExists = globalState.conversations.some((c) => payload._id === c._id);
    if (!conversationExists)
        globalState.conversations.push(payload);
    sortConversations();
    renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
});
socket.on("sendMessage", (message) => {
    if (!globalState.user?._id)
        return;
    renderHandlers.renderSingleMessage(message, globalState.user?._id.toString(), messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
    socket.emit("getConversations", { userId: globalState.user._id });
    sortConversations();
    renderHandlers.renderListOfContacts(socket, conversationsContainer, globalState.conversations);
});
//event listeners
newMessageInput.addEventListener("keydown", (e) => socketEventsHelpers.sendMessage(e, socket, newMessageInput));
newMessageBtn.addEventListener("click", async () => {
    if (!globalState.user?._id)
        return;
    const contacts = await getContacts(globalState.user?._id);
    allContactsSection.classList.replace("hidden", "block");
    if (!contacts || contacts?.length <= 0)
        return;
    renderHandlers.renderListOfContacts(socket, contactsList, contacts);
});
closeContactsBtn.addEventListener("click", renderHandlers.closeContactsList);
