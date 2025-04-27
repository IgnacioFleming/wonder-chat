import DOMElements from "./DOMElements.ts";
import { socket } from "../home.ts";
import { sendMessage } from "../messages/socketEventHelpers.ts";
import { resizeMessageInput } from "../messages/utils.ts";
import { getContacts } from "../services/contacts.ts";
import { globalState } from "../store/store.ts";
import sidebarRenderings from "../sidebar/renderings.ts";
import { debounce } from "../helpers/utils.ts";
import { handleSubmitFile, searchHandler } from "./domHandlers.ts";
import { filterUnreadConversations } from "./filters.ts";
import { logout } from "../services/sessions.ts";
import { showProfile } from "../profile/renderings.ts";

export const inizializeMessageInputEventListeners = () => {
  console.log("agrego los listeners");
  DOMElements.newMessageInput.addEventListener("keydown", (e) => {
    sendMessage(e, socket, DOMElements.newMessageInput);
    resizeMessageInput();
  });

  DOMElements.newMessageInput.addEventListener("input", () => {
    if (DOMElements.newMessageInput.value.length > 0) DOMElements.sendButton.classList.remove("disabled");
    else DOMElements.sendButton.classList.add("disabled");
    resizeMessageInput();
  });
  DOMElements.sendButton.addEventListener("click", (e) => {
    sendMessage(e, socket, DOMElements.newMessageInput);
    resizeMessageInput();
  });
  DOMElements.newMessageBtn.addEventListener("click", async () => {
    if (!globalState.user?._id) return;
    DOMElements.allContactsSection.classList.replace("hidden", "block");
    const contacts = await getContacts(globalState.user?._id);
    if (!contacts || contacts?.length <= 0) return;
    globalState.contacts = [...contacts];
    sidebarRenderings.renderListOfContacts(socket, DOMElements.contactsList, contacts);
  });
  DOMElements.emojiBtn.addEventListener("click", () => {
    console.log("entro aca");
    DOMElements.emojiPicker.classList.toggle("scaleOut");
    setTimeout(() => {
      DOMElements.emojiPicker.classList.toggle("hidden");
      DOMElements.emojiPicker.classList.toggle("scaleOut");
    }, 190);
  });
};

export const initializeDOMEventListeners = () => {
  inizializeMessageInputEventListeners();

  DOMElements.closeContactsBtn.addEventListener("click", sidebarRenderings.closeContactsList);

  DOMElements.searchConversations.addEventListener("keyup", debounce(searchHandler(socket, DOMElements.conversationsContainer, "conversations"), 500));
  DOMElements.searchContacts.addEventListener("keyup", debounce(searchHandler(socket, DOMElements.contactsList, "contacts"), 500));

  DOMElements.filtersContainer.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.matches("input[type='radio']")) return;
    if (target.id === "opt-all") return sidebarRenderings.renderListOfContacts(socket, DOMElements.conversationsContainer, globalState.conversations);
    if (target.id === "opt-unread") {
      const unreadConversations = filterUnreadConversations();
      return sidebarRenderings.renderListOfContacts(socket, DOMElements.conversationsContainer, unreadConversations);
    }
  });

  DOMElements.logoutBtn.addEventListener("click", logout);
  DOMElements.profileBtn.addEventListener("click", () => showProfile());

  const uploadBtn = document.querySelector(".hidden-btn");
  const submitFileBtn = document.getElementById("submit-file-btn");

  DOMElements.avatarInput.addEventListener("change", () => {
    if (DOMElements.avatarInput.files) DOMElements.filename.innerText = DOMElements.avatarInput.files[0].name;
    if (uploadBtn) uploadBtn.classList.remove("hidden-btn");
  });
  submitFileBtn?.addEventListener("click", () => handleSubmitFile(DOMElements.avatarInput.files?.[0]));

  DOMElements.backToChatsBtn.addEventListener("click", () => {
    if (DOMElements.profileContainer.classList.contains("hidden")) return;
    DOMElements.profileContainer.classList.add("close");
    setTimeout(() => {
      DOMElements.profileContainer.classList.add("hidden");
      DOMElements.profileContainer.classList.remove("close");
    }, 180);
  });

  DOMElements.burguerBtn.addEventListener("click", sidebarRenderings.toggleShowSidebar);
};
