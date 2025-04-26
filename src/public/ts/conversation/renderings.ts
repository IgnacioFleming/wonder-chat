import { UserWithId } from "../../../types/types.js";
import { formatLastConnectionDate, initialConversationHtml } from "./utils.ts";

const renderConversationHeader = ({ full_name, photo, is_online, last_connection }: Omit<UserWithId, "password">) => {
  const headerSection = document.querySelector(".conversation header") as HTMLElement;
  headerSection.classList.add("hasMessages");
  headerSection.innerHTML = `
     <div class="list-item">
        <img class="avatar" src="${photo || "/profile/uploads/avatar1.webp"}" alt="photo" />
        <p>${full_name}
        <small id="last_connection_label">${is_online ? "online" : formatLastConnectionDate({ is_online: false, last_connection })}</small>
        </p>
      </div>
    `;
};

const closeCurrentConversation = () => {
  const conversationContainer = document.querySelector(".mainContainer .relative-container .conversation") as HTMLElement;
  conversationContainer.innerHTML = initialConversationHtml;
};

const setConversationFooterVisible = () => {
  const footer = document.querySelector(".conversation-footer") as HTMLElement;
  footer.classList.replace("hidden", "visible");
};

export default {
  renderConversationHeader,
  closeCurrentConversation,
  setConversationFooterVisible,
};
