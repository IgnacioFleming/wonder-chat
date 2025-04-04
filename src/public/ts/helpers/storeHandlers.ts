import { PopulatedConversation, UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";

export const setUser = (user: Omit<UserWithId, "password">) => {
  globalState.user = user;
  return localStorage.setItem("user", JSON.stringify(user));
};

export const sortConversations = () => {
  return globalState.conversations.sort((a, b) => {
    const dateA = a.date ? new Date(a?.date).getTime() : 0;
    const dateB = b.date ? new Date(b?.date).getTime() : 0;
    return dateB - dateA;
  });
};
