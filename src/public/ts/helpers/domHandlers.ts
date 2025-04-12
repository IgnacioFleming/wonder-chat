import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types/websockets.js";
import { filterConversationsBySearch } from "./filters.ts";
import renderHandlers from "./renderHandlers.ts";
import { globalState } from "../store.ts";

export const searchHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents>, element: HTMLElement) => {
  let lastSearch = "";
  return (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const search = target.value.trim();
    if (search === lastSearch) return;
    lastSearch = search;
    if (search) {
      const filteredConversations = filterConversationsBySearch(search);
      console.log(filteredConversations);
      renderHandlers.renderListOfContacts(socket, element, filteredConversations);
    } else {
      renderHandlers.renderListOfContacts(socket, element, globalState.conversations);
    }
  };
};
