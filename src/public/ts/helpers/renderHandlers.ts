import { Socket } from "socket.io";
import { Message, PopulatedConversation, UserWithId } from "../../../types/types.js";
import { allContactsSection } from "../home.ts";
import { isPopulatedConversation } from "./typeGuards.ts";
import { globalState } from "../store.ts";
import socketEventsHelpers from "./socketEventsHelpers.ts";
import { getHourFromDate } from "./utils.ts";

const renderMessages = (messages: Message[], senderId: string) => {
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  messagesSection.innerHTML = "";
  messages.forEach((message) => renderSingleMessage(message, senderId, messagesSection));
};

const renderSingleMessage = (message: Message, senderId: string, target: HTMLElement) => {
  console.log(message);
  const paragraph = document.createElement("p");

  paragraph.innerHTML = `${message.content}<span class="message-time">${message.date ? getHourFromDate(new Date(message.date)) : ""}</span>`;

  paragraph.className = "message";
  if (message.author.toString() === senderId) paragraph.classList.add("sent");
  target.appendChild(paragraph);
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

const renderListOfContacts = (socket: Socket, anchorElement: HTMLElement, payload: PopulatedConversation[] | UserWithId[]) => {
  anchorElement.innerHTML = "";
  payload.forEach((item) => {
    let contact: UserWithId;
    let lastMessageContent = "";
    if (isPopulatedConversation(item)) {
      const [other] = item.participants.filter((p) => p._id !== globalState.user?._id);
      contact = other;
      lastMessageContent = item.lastMessage ?? "";
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
    conversationDiv.addEventListener("click", () => socketEventsHelpers.openConversation(socket, contact));
    anchorElement.appendChild(conversationDiv);
  });
};

const closeContactsList = () => {
  allContactsSection.classList.add("close");
  setTimeout(() => {
    allContactsSection.classList.replace("block", "hidden");
    allContactsSection.classList.remove("close");
  }, 270);
};

const setConversationFooterVisible = () => {
  const footer = document.querySelector(".conversation-footer") as HTMLElement;
  footer.classList.replace("hidden", "visible");
};

export default {
  renderMessages,
  renderSingleMessage,
  renderConversationHeader,
  renderListOfContacts,
  closeContactsList,
  setConversationFooterVisible,
};
