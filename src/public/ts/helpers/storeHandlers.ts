import { UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";

export const setUser = (user: Omit<UserWithId, "password">) => {
  globalState.user = user;
  return localStorage.setItem("user", JSON.stringify(user));
};

export const updateUser = (data: Partial<Omit<UserWithId, "password">>) => {
  globalState.user = { ...globalState.user, ...data } as Omit<UserWithId, "password">;
  return localStorage.setItem("user", JSON.stringify(globalState.user));
};

export const sortConversations = () => {
  return globalState.conversations.sort((a, b) => {
    const dateA = a.date ? new Date(a?.date).getTime() : 0;
    const dateB = b.date ? new Date(b?.date).getTime() : 0;
    return dateB - dateA;
  });
};
