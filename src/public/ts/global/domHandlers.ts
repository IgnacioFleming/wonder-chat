import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { filterConversationsByFullName, filterContactsByFullName } from "./filters.ts";
import { updateUserPhoto } from "../services/users.ts";
import sidebarRenderings from "../sidebar/renderings.ts";
import { globalState } from "../store/store.ts";

export const searchHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, element: HTMLElement, items: "conversations" | "contacts") => {
  let lastSearch = "";
  return (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const search = target.value.trim();
    if (search === lastSearch) return;
    lastSearch = search;
    if (search) {
      const filteredItems = items === "conversations" ? filterConversationsByFullName(search) : filterContactsByFullName(search);
      sidebarRenderings.renderListOfContacts(socket, element, filteredItems);
    } else {
      sidebarRenderings.renderListOfContacts(socket, element, items === "conversations" ? globalState.conversations : globalState.contacts);
    }
  };
};

export const handleSubmitFile = async (file: File | undefined) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  const url = await updateUserPhoto(formData);
  if (url) {
    const profileImg = document.getElementById("profile-image") as HTMLImageElement | undefined;
    if (profileImg) {
      const imgDescription = document.getElementById("filename-preview") as HTMLParagraphElement;
      imgDescription.innerText = "";
      const uploadBtn = document.getElementById("submit-file-btn") as HTMLButtonElement;
      uploadBtn.classList.add("hidden-btn");
      setTimeout(() => (profileImg.src = `${url}?t=${Date.now()}`), 1500);
    }
  }
};
