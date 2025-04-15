import { Socket } from "socket.io";
import { UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";
import renderHandlers from "./renderHandlers.ts";
import { allContactsSection, messagesSection, searchContacts } from "../home.ts";
import { isToday, markConversationRead } from "./utils.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { isKeyboardEvent } from "./typeGuards.ts";

const userId = globalState.user?._id;
const setSelectedContact = (selectedContact: Omit<UserWithId, "password">) => {
  if (allContactsSection.classList.contains("block")) renderHandlers.closeContactsList();
  if (selectedContact === globalState.selectedContact.contact) return;
  if (globalState.selectedContact.contact === null) renderHandlers.setConversationFooterVisible();
  globalState.selectedContact.contact = selectedContact;
  globalState.selectedContact.lastMessageDate = null;
  return;
};

const openConversation = (socket: Socket<ServerToClientEvents, ClientToServerEvents>, contact: Omit<UserWithId, "password">) => {
  if (!userId || contact._id === globalState.selectedContact.contact?._id) return;
  searchContacts.value = "";
  setSelectedContact(contact);
  const conversation = globalState.conversations.find((c) => c.participants.some((p) => p._id === contact._id));
  const badgeElement = document.querySelector(`div[data-conversationid="${conversation?._id}"] .badge`);
  if (badgeElement) badgeElement.remove();
  messagesSection.innerHTML = "";
  renderHandlers.renderConversationHeader({ full_name: contact.full_name, photo: contact.photo });
  socket.emit("getMessages", { userId, contactId: contact._id });
  socket.on("sendMessages", (result) => {
    if (result.length <= 0) return;
    const lastMessage = result[result.length - 1];
    const lastMessageDate = lastMessage.date;
    if (lastMessageDate) globalState.selectedContact.lastMessageDate = new Date(lastMessageDate);
    renderHandlers.renderMessages(result, userId.toString());
    if (lastMessage.author === contact._id) markConversationRead(userId, contact._id);
    socket.emit("updateMessagesToRead", { userId, contactId: contact._id });
    return;
  });
};

const sendMessage = (e: KeyboardEvent | MouseEvent, socket: Socket, newMessageInput: HTMLTextAreaElement) => {
  if (!userId) return;
  if (isKeyboardEvent(e) && e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  if (globalState.selectedContact.lastMessageDate && !isToday(globalState.selectedContact.lastMessageDate)) {
    renderHandlers.addHeading("TODAY", messagesSection);
    globalState.selectedContact.lastMessageDate = new Date();
  }
  socket.emit("newMessage", { author: userId, receiver: globalState.selectedContact?.contact?._id || "", content });
  newMessageInput.value = "";
};

export default { sendMessage, openConversation };
