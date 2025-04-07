import { MessageWithId } from "../../../types/types.js";
import { setDateLabel } from "./utils.ts";

type MessageGroup = {
  date: string;
  messages: MessageWithId[];
};

export const groupMessagesByDate = (messages: MessageWithId[]): MessageGroup[] => {
  const groups: { [key: string]: MessageWithId[] } = {};
  messages.forEach((message) => {
    if (!message.date) return groups["Today"].push(message);
    const label = setDateLabel(message.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(message);
  });
  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages,
  }));
};
