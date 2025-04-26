import { Socket } from "socket.io";
import { isKeyboardEvent } from "../helpers/typeGuards.ts";
import { isToday } from "../helpers/utils.ts";
import renderings from "./renderings.ts";
import DOMElements from "../global/DOMElements.ts";
import { globalState } from "../store/store.ts";

const userId = globalState.user?._id;

export const sendMessage = (e: KeyboardEvent | MouseEvent, socket: Socket, newMessageInput: HTMLTextAreaElement) => {
  if (!userId) return;
  if (isKeyboardEvent(e) && e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  if (globalState.selectedContact.lastMessageDate && !isToday(globalState.selectedContact.lastMessageDate)) {
    renderings.addHeading("TODAY", DOMElements.messagesSection);
    globalState.selectedContact.lastMessageDate = new Date();
  }
  socket.emit("newMessage", { author: userId, receiver: globalState.selectedContact?.contact?._id || "", content });
  newMessageInput.value = "";
};
