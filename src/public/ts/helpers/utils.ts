export const getHourFromDate = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

export const setDateLabel = (date: Date) => {
  const parsedDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (parsedDate.toDateString() === today.toDateString()) return "Today";
  else if (parsedDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  else {
    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
