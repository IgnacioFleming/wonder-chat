import { PopulatedConversationWithId, UserWithId } from "../../../types/types.js";

type GlobalState = {
  user: Omit<UserWithId, "password"> | null;
  selectedContact: { contact: Omit<UserWithId, "password"> | null; lastMessageDate: Date | null };
  conversations: PopulatedConversationWithId[];
  contacts: UserWithId[];
};

const persistedUser = localStorage.getItem("user");

export const globalState: GlobalState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,
  selectedContact: { contact: null, lastMessageDate: null },
  conversations: [],
  contacts: [],
};
