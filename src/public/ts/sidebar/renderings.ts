import { PopulatedConversationWithId, UserWithId } from "../../../types/types.js";
import { getContactHtml } from "../conversation/utils.ts";
import { isPopulatedConversation } from "../helpers/typeGuards.ts";
import conversationSocketHandlers from "../conversation/socketEventHandlers.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { Socket } from "socket.io";
import DOMElements from "../global/DOMElements.ts";
import { globalState } from "../store/store.ts";

const renderContact = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, item: UserWithId | PopulatedConversationWithId, anchorElement: HTMLElement, onTop = false) => {
  let contact: UserWithId;
  if (isPopulatedConversation(item)) {
    const [other] = item.participants.filter((p) => p._id !== globalState.user?._id);
    contact = other;
  } else {
    contact = item;
  }
  const conversationDiv = document.createElement("div");
  conversationDiv.setAttribute("data-conversationid", item._id.toString());
  conversationDiv.classList.add("list-group-item", "list-item", "contact");
  conversationDiv.innerHTML = getContactHtml(item, contact);
  conversationDiv.addEventListener("click", () => {
    conversationSocketHandlers.openConversation(socket, contact);
    toggleShowSidebar();
  });
  if (onTop) anchorElement.prepend(conversationDiv);
  else anchorElement.appendChild(conversationDiv);
};

const renderListOfContacts = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, anchorElement: HTMLElement, listItems: PopulatedConversationWithId[] | UserWithId[]) => {
  anchorElement.innerHTML = "";
  listItems.forEach((item) => {
    renderContact(socket, item, anchorElement);
  });
};

const sortSingleConversation = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, conversation: PopulatedConversationWithId) => {
  const conversationDiv = document.querySelector(`.conversations .contact[data-conversationid="${conversation._id}"]`);
  if (conversationDiv) {
    conversationDiv.remove();
    renderContact(socket, conversation, DOMElements.conversationsContainer, true);
  } else {
    renderContact(socket, conversation, DOMElements.conversationsContainer, true);
  }
};

const closeContactsList = () => {
  DOMElements.allContactsSection.classList.add("close");
  setTimeout(() => {
    DOMElements.allContactsSection.classList.replace("block", "hidden");
    DOMElements.allContactsSection.classList.remove("close");
  }, 270);
};

const toggleShowSidebar = () => {
  DOMElements.sidebar.classList.toggle("collapsed");
};

export default {
  closeContactsList,
  sortSingleConversation,
  renderListOfContacts,
  toggleShowSidebar,
};
