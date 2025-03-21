import { ClientMessage, Conversation, ObjectId, UserWithId } from "../../types/types.js";
import helpers from "./helpers.ts";

declare global {
  interface Window {
    io: any;
  }
}

const user: Omit<UserWithId, "password"> = JSON.parse(localStorage.getItem("user") || "{}");
if (!user?._id) window.location.href = "/login";
const userId: ObjectId = user._id;
const contactId = "67c21a97ef46abfc1c2785bd";
const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;

const socket = window.io();

socket.emit("register", userId);
socket.emit("getConversations", { userId });
socket.on("getConversations", ({ payload }: { payload: Conversation[] }) => {
  console.log(payload);
});

socket.on("sendMessage", ({ payload }: { payload: ClientMessage }) => {
  const messagesSection = document.querySelector("section.messages") as HTMLElement;
  helpers.renderSingleMessage(payload, userId.toString(), messagesSection);
  messagesSection.scrollTop = messagesSection.scrollHeight;
});

//this code block has to be called in a function when the user enters a conversation.

// socket.emit("getMessages", { userId, contactId });
// socket.on("getMessages", ({ status, payload }: { status: "success" | "error"; payload: ClientMessage[] }) => {
//   if (status === "success") return helpers.renderMessages(payload, userId.toString());
// });

newMessageInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const content = newMessageInput.value.trim();
  if (!content) return;
  helpers.sendMessage(socket, { author: userId.toString(), receiver: contactId, content });
  newMessageInput.value = "";
});
