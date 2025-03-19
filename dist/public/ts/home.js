import helpers from "./helpers.js";
const userId = "67d1a36de8cb001745329a8d";
const contactId = "67c21a97ef46abfc1c2785bd";
const newMessageInput = document.getElementById("newMessage");
const socket = window.io();
socket.emit("register", userId);
socket.on("sendMessage", ({ payload }) => {
    const messagesSection = document.querySelector("section.messages");
    helpers.renderSingleMessage(payload, userId, messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
});
socket.emit("getMessages", { userId, contactId });
socket.on("getMessages", ({ status, payload }) => {
    if (status === "success")
        return helpers.renderMessages(payload, userId);
});
newMessageInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    const content = newMessageInput.value.trim();
    if (!content)
        return;
    helpers.sendMessage(socket, { author: userId, receiver: contactId, content });
    newMessageInput.value = "";
});
