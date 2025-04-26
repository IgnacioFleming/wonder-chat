import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { UserWithId } from "../../../types/types.js";
import { deleteSelectedContact, setSelectedContact } from "./store.ts";
import renderings from "./renderings.ts";
import messageRenderings from "../messages/renderings.ts";
import { markConversationRead } from "../messages/utils.ts";
import DOMElements from "../global/DOMElements.ts";
import { globalState } from "../store/store.ts";

const userId = globalState.user?._id;
const openConversation = (socket: Socket<ServerToClientEvents, ClientToServerEvents>, contact: Omit<UserWithId, "password">) => {
  if (!userId || contact._id === globalState.selectedContact.contact?._id) return;
  DOMElements.searchContacts.value = "";
  setSelectedContact(contact);
  const conversation = globalState.conversations.find((c) => c.participants.some((p) => p._id === contact._id));
  const badgeElement = document.querySelector(`div[data-conversationid="${conversation?._id}"] .badge`);
  if (badgeElement) badgeElement.remove();
  DOMElements.messagesSection.innerHTML = "";
  renderings.renderConversationHeader(contact);
  socket.emit("getMessages", { userId, contactId: contact._id });
  socket.on("sendMessages", (result) => {
    if (result.length <= 0) return;
    const lastMessage = result[result.length - 1];
    const lastMessageDate = lastMessage.date;
    if (lastMessageDate) globalState.selectedContact.lastMessageDate = new Date(lastMessageDate);
    messageRenderings.renderMessages(result, userId.toString());
    if (lastMessage.author === contact._id) markConversationRead(userId, contact._id);
    socket.emit("updateMessagesToRead", { userId, contactId: contact._id });
    return;
  });
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape") return;
      renderings.closeCurrentConversation();
      deleteSelectedContact();
    },
    { once: true }
  );
};

export default {
  openConversation,
};
