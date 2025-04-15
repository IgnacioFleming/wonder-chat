import { UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";

export const setUser = (user: Omit<UserWithId, "password">) => {
  globalState.user = user;
  return localStorage.setItem("user", JSON.stringify(user));
};
