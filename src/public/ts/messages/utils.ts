import { GeneralId } from "../../../types/types.js";
import DOMElements from "../global/DOMElements.ts";
import { globalState } from "../store/store.ts";

export const markConversationRead = (userId: GeneralId, contactId: GeneralId) => {
  const conversation = globalState.conversations.find((c) => {
    const ids = c.participants.map((c) => c._id);
    return ids.includes(userId) && ids.includes(contactId);
  });
  if (conversation) conversation.status = "read";
};

export const resizeMessageInput = () => {
  DOMElements.newMessageInput.style.height = "auto";
  DOMElements.newMessageInput.style.height = `${DOMElements.newMessageInput.scrollHeight}px`;
};
