import { UserWithId } from "../../types/types.js";

type GlobalState = {
  user: Omit<UserWithId, "password"> | null;
  selectedContact: Omit<UserWithId, "password"> | null;
};

const persistedUser = localStorage.getItem("user");
const persistedContact = localStorage.getItem("selectedContact");

export const GlobalState: GlobalState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,
  selectedContact: persistedContact ? JSON.parse(persistedContact) : null,
};
