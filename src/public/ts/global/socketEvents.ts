import { socket } from "../home.ts";
import { globalState } from "../store/store.ts";
import sidebarRenderings from "../sidebar/renderings.ts";
import { sortConversations } from "../store/storeHandlers.ts";
import DOMElements from "./DOMElements.ts";
import messageRenderings from "../messages/renderings.ts";
import { formatLastConnectionDate } from "../conversation/utils.ts";

export const initializeSocketListeners = () => {
  socket.on("sendConversations", ({ payload }) => {
    globalState.conversations = [...payload];
    sortConversations();
    sidebarRenderings.renderListOfContacts(socket, DOMElements.conversationsContainer, globalState.conversations);
  });
  socket.on("sendConversation", ({ payload }) => {
    const conversationIndex = globalState.conversations.findIndex((c) => payload._id === c._id);
    if (conversationIndex < 0) globalState.conversations.push(payload);
    else globalState.conversations[conversationIndex] = payload;
    sidebarRenderings.sortSingleConversation(socket, payload);
  });

  socket.on("sendMessage", (message) => {
    if (!globalState.user?._id) return;
    if (globalState.selectedContact.contact?._id === message.author || globalState.selectedContact.contact?._id === message.receiver) {
      messageRenderings.renderSingleMessage(message, globalState.user?._id.toString(), DOMElements.messagesSection);
    }
    if (globalState.selectedContact.contact?._id === message.author) {
      const conversationId = globalState.conversations.find((c) => c.lastMessageId === message._id)?._id;
      const badgeElement = document.querySelector(`div[data-conversationid="${conversationId}"] .badge`);
      if (badgeElement) badgeElement.remove();
      if (globalState.user) socket.emit("updateMessagesToRead", { contactId: message.author, userId: globalState.user?._id });
    }
    DOMElements.messagesSection.scrollTo({
      top: DOMElements.messagesSection.scrollHeight,
      behavior: "smooth",
    });
  });

  socket.on("updateMessageStatus", ({ message, status }) => {
    const messageIcon = DOMElements.messagesSection.querySelector(`[data-msgid="${message._id}"]`)?.querySelector("i");
    const conversationIcon = document.querySelector(`i[data-conversationid="${message._id}"]`) as HTMLElement;
    if (status === "received") {
      messageIcon?.classList.replace("bi-check2", "bi-check2-all");
      conversationIcon.classList.replace("bi-check2", "bi-check2-all");
    }
    if (status === "read") {
      messageIcon?.classList.add("msg-read");
      conversationIcon.classList.add("msg-read");
    }
  });

  socket.on("notifyConnection", ({ is_online, last_connection, userId }) => {
    if (userId !== globalState.selectedContact.contact?._id.toString()) return;
    const label = document.getElementById("last_connection_label");
    if (!label) return;
    if (is_online) return (label.innerText = "online");
    label.innerText = `${formatLastConnectionDate({ is_online, last_connection })}`;
  });
};
