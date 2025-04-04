import { PopulatedConversationWithId, UserWithId } from "../../types/types.js";

type GlobalState = {
  user: Omit<UserWithId, "password"> | null;
  selectedContact: Omit<UserWithId, "password"> | null;
  conversations: PopulatedConversationWithId[];
};

const persistedUser = localStorage.getItem("user");

export const globalState: GlobalState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,
  selectedContact: null,
  conversations: [],
};
