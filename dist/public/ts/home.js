import helpers from "./helpers.js";
const user = JSON.parse(localStorage.getItem("user") || "{}");
if (!user?._id)
    window.location.href = "/login";
const userId = user._id;
const contactId = "67c21a97ef46abfc1c2785bd";
const newMessageInput = document.getElementById("newMessage");
const socket = window.io();
socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }) => {
    console.log(payload);
});
socket.on("sendMessage", ({ payload }) => {
    const messagesSection = document.querySelector("section.messages");
    helpers.renderSingleMessage(payload, userId.toString(), messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
});
//this code block has to be called in a function when the user enters a conversation.
// socket.emit("getMessages", { userId, contactId });
// socket.on("getMessages", ({ status, payload }: { status: "success" | "error"; payload: ClientMessage[] }) => {
//   if (status === "success") return helpers.renderMessages(payload, userId.toString());
// });
newMessageInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    const content = newMessageInput.value.trim();
    if (!content)
        return;
    helpers.sendMessage(socket, { author: userId.toString(), receiver: contactId, content });
    newMessageInput.value = "";
});
