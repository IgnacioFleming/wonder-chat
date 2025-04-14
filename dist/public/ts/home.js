import helpers from "./helpers.js";
import { getContacts } from "./services/contacts.js";
import { GlobalState } from "./store.js";
if (!GlobalState.user || !GlobalState.user._id)
    window.location.href = "/login";
const userId = GlobalState.user?._id;
let contactId = GlobalState.selectedContact?._id;
//key elements
const newMessageInput = document.getElementById("newMessage");
export const allContactsSection = document.getElementById("contacts");
const contactsList = document.getElementById("contacts-list");
const newMessageBtn = document.getElementById("new-message-btn");
const closeContactsBtn = document.getElementById("close-contacts");
//socket events
const socket = window.io();
socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }) => {
    const conversationsContainer = document.querySelector(".conversations");
    helpers.renderListOfContacts(socket, conversationsContainer, payload);
});
socket.on("sendMessage", (message) => {
    if (!userId)
        return;
    const messagesSection = document.querySelector("section.messages");
    helpers.renderSingleMessage(message, userId.toString(), messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
});
//event listeners
newMessageInput.addEventListener("keydown", (e) => helpers.sendMessage(e, socket, newMessageInput));
newMessageBtn.addEventListener("click", async () => {
    if (!userId)
        return;
    const contacts = await getContacts(userId);
    allContactsSection.classList.replace("hidden", "block");
    if (!contacts || contacts?.length <= 0)
        return;
    helpers.renderListOfContacts(socket, contactsList, contacts);
});
closeContactsBtn.addEventListener("click", helpers.closeContactsList);
