import { Socket } from "socket.io";
import { Message, UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";
import renderHandlers from "./renderHandlers.ts";
import { allContactsSection } from "../home.ts";

const userId = globalState.user?._id;
const setSelectedContact = (selectedContact: Omit<UserWithId, "password">) => {
  if (allContactsSection.classList.contains("block")) renderHandlers.closeContactsList();
  if (globalState.selectedContact === null) renderHandlers.setConversationFooterVisible();
  return (globalState.selectedContact = selectedContact);
};

const openConversation = (socket: Socket, contact: Omit<UserWithId, "password">) => {
  if (!userId) return;
  setSelectedContact(contact);
  renderHandlers.renderConversationHeader({ full_name: contact.full_name, photo: contact.photo });
  socket.emit("getMessages", { userId, contactId: contact._id });
  socket.on("sendMessages", (result: Message[]) => {
    if (result.length > 0) return renderHandlers.renderMessages(result, userId.toString());
  });
};

const sendMessage = (e: KeyboardEvent, socket: Socket, newMessageInput: HTMLTextAreaElement) => {
  if (!userId) return;
  if (e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  socket.emit("newMessage", { author: userId, receiver: globalState.selectedContact?._id || "", content });
  newMessageInput.value = "";
};

export default { sendMessage, openConversation };
