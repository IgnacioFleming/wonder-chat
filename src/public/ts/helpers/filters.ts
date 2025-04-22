import { PopulatedConversationWithId } from "../../../types/types.js";
import { globalState } from "../store.ts";

export const filterConversationsBySearch = (search: string): PopulatedConversationWithId[] => {
  return globalState.conversations.filter((c) => {
    const contact = c.participants.find((p) => p._id !== globalState.user?._id);
    return contact?.full_name.includes(search);
  });
};
