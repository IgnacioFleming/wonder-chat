import { Socket } from "socket.io";
import { ClientMessage, PopulatedConversation, UserWithId } from "../../types/types.js";
import { GlobalState } from "./store.ts";

const userId = GlobalState.user?._id;

const isPopulatedConversation = (item: any): item is PopulatedConversation => {
  return "participants" in item && Array.isArray(item.participants);
};

const openConversation = (socket: Socket, contact: Omit<UserWithId, "password">) => {
  if (!userId) return;
  setSelectedContact(contact);
  renderConversationHeader({ full_name: contact.full_name, photo: contact.photo });
  socket.emit("getMessages", { userId, contactId: contact._id });
  socket.on("sendMessages", (result: ClientMessage[]) => {
    if (result.length > 0) return renderMessages(result, userId.toString());
  });
};

const renderMessages = (messages: ClientMessage[], senderId: string) => {
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  messagesSection.innerHTML = "";
  messages.forEach((message) => renderSingleMessage(message, senderId, messagesSection));
};

const renderSingleMessage = (message: ClientMessage, senderId: string, target: HTMLElement) => {
  const paragraph = document.createElement("p");
  paragraph.innerText = message.content;
  paragraph.className = "message";
  if (message.author === senderId) paragraph.classList.add("sent");
  target.appendChild(paragraph);
};

const sendMessage = async (socket: Socket, message: ClientMessage) => {
  socket.emit("newMessage", message);
};

const renderConversationHeader = ({ full_name, photo }: Pick<UserWithId, "full_name" | "photo">) => {
  const headerSection = document.querySelector(".conversation header") as HTMLElement;
  headerSection.classList.add("hasMessages");
  headerSection.innerHTML = `
   <div class="list-item">
      <img class="avatar" src="${photo || "/images/avatar1.png"}" alt="photo" />
      <p>${full_name}</p>
    </div>
    <i class="bi bi-search pointer" style="font-size: 20px;"></i>
    <i class="bi bi-three-dots-vertical pointer" style="font-size: 24px;"></i>
  `;
};

const setSelectedContact = (selectedContact: Omit<UserWithId, "password">) => {
  GlobalState.selectedContact = selectedContact;
  return localStorage.setItem("selectedContact", JSON.stringify(selectedContact));
};

const setUser = (user: Omit<UserWithId, "password">) => {
  GlobalState.user = user;
  return localStorage.setItem("user", JSON.stringify(user));
};

const renderListOfContacts = (socket: Socket, anchorElement: HTMLElement, payload: PopulatedConversation[] | UserWithId[]) => {
  anchorElement.innerHTML = "";
  payload.forEach((item) => {
    let contact: UserWithId;
    let lastMessageContent = "";
    if (isPopulatedConversation(item)) {
      const [other] = item.participants.filter((p) => p._id !== GlobalState.user?._id);
      contact = other;
      lastMessageContent = item.lastMessage?.content ?? "";
    } else {
      contact = item;
    }
    const conversationDiv = document.createElement("div");
    conversationDiv.classList.add("list-group-item", "list-item", "contact");
    conversationDiv.innerHTML = `
      <img class="avatar" src="${contact.photo || "/images/avatar1.png"}" alt="profile avatar" />
      <div>
          <h3 class="conversation-name">${contact.full_name}</h3>
          ${lastMessageContent ? `<p class="last-message">${lastMessageContent}</p>` : ""}
      </div>
          `;
    conversationDiv.addEventListener("click", () => openConversation(socket, contact));
    anchorElement.appendChild(conversationDiv);
  });
};

export default { renderMessages, renderSingleMessage, renderConversationHeader, sendMessage, setSelectedContact, setUser, renderListOfContacts };
