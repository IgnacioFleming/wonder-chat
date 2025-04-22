import { PopulatedConversation } from "../../../types/types.js";

export const isPopulatedConversation = (item: any): item is PopulatedConversation => {
  return "participants" in item && Array.isArray(item.participants);
};

export const isKeyboardEvent = (event: any): event is KeyboardEvent => {
  return event.key ? true : false;
};
