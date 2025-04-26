import { UserWithId } from "../../../types/types.js";
import renderings from "./renderings.ts";
import sidebarRenderings from "../sidebar/renderings.ts";
import DOMElements from "../global/DOMElements.ts";
import { globalState } from "../store/store.ts";

export const setSelectedContact = (selectedContact: Omit<UserWithId, "password">) => {
  if (DOMElements.allContactsSection.classList.contains("block")) sidebarRenderings.closeContactsList();
  if (selectedContact === globalState.selectedContact.contact) return;
  if (globalState.selectedContact.contact === null) renderings.setConversationFooterVisible();
  globalState.selectedContact.contact = selectedContact;
  globalState.selectedContact.lastMessageDate = null;
  return;
};
export const deleteSelectedContact = () => {
  globalState.selectedContact = { contact: null, lastMessageDate: null };
  localStorage.setItem("selectedContact", JSON.stringify(globalState.selectedContact));
};
