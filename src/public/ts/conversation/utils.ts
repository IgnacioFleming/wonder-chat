import { PopulatedConversationWithId, UserWithId } from "../../../types/types.js";
import { globalState } from "../store/store.ts";
import { isPopulatedConversation } from "../helpers/typeGuards.ts";
import { getHourFromDate, setDateLabel } from "../helpers/utils.ts";

export const getContactHtml = (item: UserWithId | PopulatedConversationWithId, contact: UserWithId) => {
  const fallbackPhoto = "/profile/uploads/avatar1.webp";
  let html = `
    <img class="avatar" src="${contact.photo || fallbackPhoto}" onerror="this.src='${fallbackPhoto}'" alt="profile avatar" />
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

export const formatLastConnectionDate = ({ is_online, last_connection }: { is_online: boolean; last_connection: Date | undefined }) => {
  if (is_online) return "online";
  if (!last_connection) return "";
  const day = setDateLabel(last_connection);
  const hour = getHourFromDate(new Date(last_connection));
  if (day === "Today") return hour;
  return `${day} ${hour}`;
};
