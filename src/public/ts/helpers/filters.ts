import { PopulatedConversationWithId, UserWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";

export const filterConversationsByFullName = (search: string): PopulatedConversationWithId[] => {
  return globalState.conversations.filter((c) => {
    const contact = c.participants.find((p) => p._id !== globalState.user?._id);
    return contact?.full_name.includes(search);
  });
};

export const filterContactsByFullName = (search: string): UserWithId[] => {
  return globalState.contacts.filter((c) => c.full_name.includes(search));
};

export const filterUnreadConversations = () => globalState.conversations.filter((c) => c.author !== globalState.user?._id && c.status !== "read");
