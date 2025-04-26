import { PopulatedConversationWithId, UserWithId } from "../../../types/types.js";
import { globalState } from "../store/store.ts";
import { isPopulatedConversation } from "../helpers/typeGuards.ts";
import { getHourFromDate, setDateLabel } from "../helpers/utils.ts";

export const initialConversationHtml = `
<section class="conversation">
<header></header>
<section class="messages"></section>
<footer class="conversation-footer hidden">
  <div class="message-input">
    <div id="emoji-picker" class="hidden"></div>
    <button id="emoji-btn" type="button" class="btn input-emoji pointer">
      <i class="bi bi-emoji-smile" style="font-size: 24px;"></i>
    </button>
    <textarea name="newMessage" id="newMessage" class="form-control form-control-lg" type="text" placeholder="Write a message" aria-label=".form-control-lg example" rows="1"></textarea>
  </div>
  <button class="sendButton disabled">
    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>wds-ic-send-filled</title><path d="M5.4 19.425C5.06667 19.5583 4.75 19.5291 4.45 19.3375C4.15 19.1458 4 18.8666 4 18.5V14L12 12L4 9.99997V5.49997C4 5.1333 4.15 4.85414 4.45 4.66247C4.75 4.4708 5.06667 4.44164 5.4 4.57497L20.8 11.075C21.2167 11.2583 21.425 11.5666 21.425 12C21.425 12.4333 21.2167 12.7416 20.8 12.925L5.4 19.425Z" fill="currentColor"></path></svg>
  </button>
</footer>
</section>`;

export const getContactHtml = (item: UserWithId | PopulatedConversationWithId, contact: UserWithId) => {
  let html = `
    <img class="avatar" src="${contact.photo || "/profile/uploads/avatar1.webp"}" alt="profile avatar" />
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
