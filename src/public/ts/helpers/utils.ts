import { GeneralId, PopulatedConversationWithId, User, UserWithId } from "../../../types/types.js";
import { newMessageInput } from "../home.ts";
import { globalState } from "../store.ts";
import { isPopulatedConversation } from "./typeGuards.ts";

export const getHourFromDate = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

export const setDateLabel = (date: Date) => {
  const parsedDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (parsedDate.toDateString() === today.toDateString()) return "Today";
  else if (parsedDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  else {
    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const getContactHtml = (item: UserWithId | PopulatedConversationWithId, contact: UserWithId) => {
  let html = `
  <img class="avatar" src="${contact.photo || "/images/avatar1.png"}" alt="profile avatar" />
  <div>
  <div class="conversation-first-line" style='${isPopulatedConversation(item) ? "" : "height:100%;"}'>
  <h3 class="conversation-name">${contact.full_name}</h3>
  `;
  if (isPopulatedConversation(item)) {
    let date = setDateLabel(item.date || new Date());
    let lastMessageContent = item.lastMessage ?? "";
    let conversationDateHtml = ` ${item.date ? `<div class="conversation-date">${date === "Today" ? getHourFromDate(new Date(item.date)) : date}</div></div>  ` : ""}     
        `;
    let lastMessageHtml = `  ${
      lastMessageContent
        ? `<div class="last-message">
          ${isPopulatedConversation(item) && item.author === globalState.user?._id ? `<span><i data-conversationId="${item.lastMessageId}" class="bi bi-${item.status === "sent" ? "check2" : "check2-all"} msg-check ${item.status === "read" && "msg-read"}"></i></span>` : ""}
          <p>${lastMessageContent}</p>
          ${item.author !== globalState.user?._id && item.unreadMessages && item.unreadMessages > 0 ? `<span class="badge text-bg-primary rounded-pill">${item.unreadMessages}</span>` : ""}
          </div>`
        : ""
    }</div>`;
    html += conversationDateHtml += lastMessageHtml;
  } else {
    html += "</div>";
  }
  return html;
};

export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export const markConversationRead = (userId: GeneralId, contactId: GeneralId) => {
  const conversation = globalState.conversations.find((c) => {
    const ids = c.participants.map((c) => c._id);
    return ids.includes(userId) && ids.includes(contactId);
  });
  if (conversation) conversation.status = "read";
};

export const formatLastConnectionDate = ({ is_online, last_connection }: { is_online: boolean; last_connection: Date | undefined }) => {
  if (is_online) return "online";
  if (!last_connection) return "";
  const day = setDateLabel(last_connection);
  const hour = getHourFromDate(new Date(last_connection));
  if (day === "Today") return hour;
  return `${day} ${hour}`;
};

export const resizeMessageInput = () => {
  newMessageInput.style.height = "auto";
  newMessageInput.style.height = `${newMessageInput.scrollHeight}px`;
};
