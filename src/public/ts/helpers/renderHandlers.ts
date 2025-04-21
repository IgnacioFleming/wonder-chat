import { Socket } from "socket.io";
import { GeneralId, MessageWithId, PopulatedConversationWithId, UserWithId } from "../../../types/types.js";
import { allContactsSection, conversationsContainer } from "../home.ts";
import { isPopulatedConversation } from "./typeGuards.ts";
import { globalState } from "../store.ts";
import socketEventsHelpers from "./socketEventsHelpers.ts";
import { getHourFromDate, setDateLabel } from "./utils.ts";
import { groupMessagesByDate } from "./groupMessagesByDate.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";

const addHeading = (text: string, target: HTMLElement) => {
  const heading = document.createElement("h6");
  heading.className = "message-heading";
  heading.innerText = text.toUpperCase();
  target.appendChild(heading);
};

const renderMessages = (messages: MessageWithId[], senderId: string) => {
  const firstUnreadMessage = messages.find((m) => m.author.toString() !== senderId && m.status !== "read");
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  messagesSection.innerHTML = "";
  if (messages.length === 0) return;
  const groupedMessages = groupMessagesByDate(messages);
  groupedMessages.forEach((group) => {
    addHeading(group.date, messagesSection);
    group.messages.forEach((message) => {
      if (message._id === firstUnreadMessage?._id && message.author.toString() !== senderId) addHeading("New Messages", messagesSection);
      renderSingleMessage(message, senderId, messagesSection);
    });
  });
  if (firstUnreadMessage) {
    const targetMessage = messagesSection.querySelector(`[data-msgid="${firstUnreadMessage._id}"]`);
    targetMessage?.scrollIntoView({ behavior: "auto", block: "center" });
  } else {
    messagesSection.scrollTop = messagesSection.scrollHeight;
  }
};

const renderSingleMessage = (message: MessageWithId, senderId: string, target: HTMLElement) => {
  const paragraph = document.createElement("div");
  paragraph.setAttribute("data-msgId", String(message._id));
  paragraph.innerHTML = `

  <p>${message.content}</p>
  <span class="message-time">${message.date ? getHourFromDate(new Date(message.date)) : getHourFromDate(new Date())}
  ${message.author.toString() === senderId ? `<i class="bi bi-${message.status === "sent" ? "check2" : "check2-all"} msg-check ${message.status === "read" && "msg-read"}"></i>` : ""}
  </span>
  `;

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

const renderListOfContacts = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, anchorElement: HTMLElement, listItems: PopulatedConversationWithId[] | UserWithId[]) => {
  anchorElement.innerHTML = "";
  listItems.forEach((item) => {
    let contact: UserWithId;
    let lastMessageContent = "";
    let date = "";
    if (isPopulatedConversation(item)) {
      const [other] = item.participants.filter((p) => p._id !== globalState.user?._id);
      contact = other;
      lastMessageContent = item.lastMessage ?? "";
      date = setDateLabel(item.date || new Date());
    } else {
      contact = item;
    }
    const conversationDiv = document.createElement("div");
    conversationDiv.setAttribute("data-conversationid", item._id.toString());
    conversationDiv.classList.add("list-group-item", "list-item", "contact");
    conversationDiv.innerHTML = `
    <img class="avatar" src="${contact.photo || "/images/avatar1.png"}" alt="profile avatar" />
    <div>
    <div class="conversation-first-line">
    <h3 class="conversation-name">${contact.full_name}</h3>
    ${isPopulatedConversation(item) && item.date ? ` <div class="conversation-date">${date === "Today" ? getHourFromDate(new Date(item.date)) : date}</div>  ` : ""}
    </div>
      ${
        lastMessageContent
          ? `<p class="last-message">
        <span>
        ${isPopulatedConversation(item) && item.author === globalState.user?._id ? `<i data-conversationId="${item.lastMessageId}" class="bi bi-${item.status === "sent" ? "check2" : "check2-all"} msg-check ${item.status === "read" && "msg-read"}"></i>` : ""}
        </span>
        ${lastMessageContent}
        </p>`
          : ""
      }
    </div>
    `;
    conversationDiv.addEventListener("click", () => socketEventsHelpers.openConversation(socket, contact));
    anchorElement.appendChild(conversationDiv);
  });
};

const sortSingleConversation = (conversationId: GeneralId) => {
  const conversation = document.querySelector(`.conversations .contact[data-conversationid="${conversationId}"]`) as HTMLDivElement;
  console.log(conversation);
  conversation.remove();
  conversationsContainer.prepend(conversation);
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
  addHeading,
  sortSingleConversation,
};
