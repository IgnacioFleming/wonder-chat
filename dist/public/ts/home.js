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
    const conversationsContainer = document.querySelector(".conversations");
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
function openConversation(contact) {
    helpers.renderConversationHeader({ full_name: contact.full_name, photo: contact.photo });
    socket.emit("getMessages", { userId, contactId: contact._id });
    socket.on("sendMessages", (result) => {
        if (result.length > 0)
            return helpers.renderMessages(result, userId.toString());
    });
}
socket.on("sendMessage", ({ payload }) => {
    const messagesSection = document.querySelector("section.messages");
    helpers.renderSingleMessage(payload, userId.toString(), messagesSection);
    messagesSection.scrollTop = messagesSection.scrollHeight;
});
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
