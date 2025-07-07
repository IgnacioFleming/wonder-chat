import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/websockets.js";
import { initializeDOMEventListeners } from "./global/DOMEventListeners.ts";
import { initializeSocketListeners } from "./global/socketEvents.ts";
import { initializeEmojis } from "./global/emojis.ts";
import { sendInitialSocketEmits } from "./global/socketEmits.ts";
import { globalState } from "./store/store.ts";

declare global {
  interface Window {
    io: () => Socket<ServerToClientEvents, ClientToServerEvents>;
  }
}

if (!globalState.user || !globalState.user._id) window.location.href = "/demo-login";
export const socket = window.io();

initializeEmojis();

sendInitialSocketEmits();

initializeSocketListeners();

initializeDOMEventListeners();
