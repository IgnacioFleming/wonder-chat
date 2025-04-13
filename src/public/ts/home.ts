import { ClientMessage } from "../../types/types.js";
import helpers from "./helpers.ts";

declare global {
  interface Window {
    io: any;
  }
}

const userId = "67d1a36de8cb001745329a8d";
const contactId = "67c21a97ef46abfc1c2785bd";
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;

const socket = window.io();

socket.emit("register", userId);

socket.on("sendMessage", ({ payload }: { payload: ClientMessage }) => {
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  helpers.renderSingleMessage(payload, userId, messagesSection);
  messagesSection.scrollTop = messagesSection.scrollHeight;
});
socket.emit("getMessages", { userId, contactId });
socket.on("getMessages", ({ status, payload }: { status: "success" | "error"; payload: ClientMessage[] }) => {
  if (status === "success") return helpers.renderMessages(payload, userId);
});

newMessageInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  helpers.sendMessage(socket, { author: userId, receiver: contactId, content });
  newMessageInput.value = "";
});
