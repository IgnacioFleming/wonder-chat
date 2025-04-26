import { MessageWithId } from "../../../types/types.js";
import { groupMessagesByDate } from "./groupMessagesByDate.ts";
import { getHourFromDate } from "../helpers/utils.ts";

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
  <span class="message-content">${message.content}</span>
  <span class="message-time">${message.date ? getHourFromDate(new Date(message.date)) : getHourFromDate(new Date())}
  ${message.author.toString() === senderId ? `<i class="bi bi-${message.status === "sent" ? "check2" : "check2-all"} msg-check ${message.status === "read" && "msg-read"}"></i>` : ""}
  </span>
  `;

  paragraph.className = "message";
  if (message.author.toString() === senderId) paragraph.classList.add("sent");
  target.appendChild(paragraph);
};

export default {
  addHeading,
  renderMessages,
  renderSingleMessage,
};
