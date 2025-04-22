import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { filterConversationsByFullName, filterContactsByFullName } from "./filters.ts";
import renderHandlers from "./renderHandlers.ts";
import { globalState } from "../store.ts";

export const searchHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, element: HTMLElement, items: "conversations" | "contacts") => {
  let lastSearch = "";
  return (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const search = target.value.trim();
    if (search === lastSearch) return;
    lastSearch = search;
    if (search) {
      const filteredItems = items === "conversations" ? filterConversationsByFullName(search) : filterContactsByFullName(search);
      renderHandlers.renderListOfContacts(socket, element, filteredItems);
    } else {
      renderHandlers.renderListOfContacts(socket, element, items === "conversations" ? globalState.conversations : globalState.contacts);
    }
  };
};
