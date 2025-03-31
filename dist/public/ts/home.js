import helpers from "./helpers.js";
import { getContacts } from "./services/contacts.js";
import { GlobalState } from "./store.js";
if (!GlobalState.user || !GlobalState.user._id)
    window.location.href = "/login";
const userId = GlobalState.user?._id;
let contactId = GlobalState.selectedContact?._id;
const newMessageInput = document.getElementById("newMessage");
const allContactsSection = document.getElementById("contacts");
const contactsList = document.getElementById("contacts-list");
const newMessageBtn = document.getElementById("new-message-btn");
const closeContactsBtn = document.getElementById("close-contacts");
const socket = window.io();
socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }) => {
    const conversationsContainer = document.querySelector(".conversations");
    helpers.renderListOfContacts(socket, conversationsContainer, payload);
});
function sendMessage(e) {
    if (!userId)
        return;
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    const content = newMessageInput.value.trim();
    if (!content)
        return;
    helpers.sendMessage(socket, { author: userId.toString(), receiver: contactId?.toString() || "", content });
    newMessageInput.value = "";
}
socket.on("sendMessage", (message) => {
    if (!userId)
        return;
    const messagesSection = document.querySelector("section.messages");
    helpers.renderSingleMessage(message, userId.toString(), messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
});
newMessageInput.addEventListener("keydown", sendMessage);
newMessageBtn.addEventListener("click", async () => {
    if (!userId)
        return;
    const contacts = await getContacts(userId);
    console.log(contacts);
    allContactsSection.classList.replace("hidden", "block");
    if (!contacts || contacts?.length <= 0)
        return;
    helpers.renderListOfContacts(socket, contactsList, contacts);
});
closeContactsBtn.addEventListener("click", () => {
    allContactsSection.classList.add("close");
    setTimeout(() => {
        allContactsSection.classList.replace("block", "hidden");
        allContactsSection.classList.remove("close");
    }, 290);
});
