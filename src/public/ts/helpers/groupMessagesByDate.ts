import { Message } from "../../../types/types.js";

type MessageGroup = {
  date: string;
  messages: Message[];
};

export const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
  const groups: { [key: string]: Message[] } = {};
  messages.forEach((message) => {
    if (!message.date) return groups["Today"].push(message);
    const msgDate = new Date(message.date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (msgDate.toDateString() === today.toDateString()) label = "Today";
    else if (msgDate.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else {
      label = msgDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(message);
  });
  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages,
  }));
};
