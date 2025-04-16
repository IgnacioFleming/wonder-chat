import { z } from "zod";

export const conversationSchema = z.object({
  participants: z.array(z.string()),
  author: z.string(),
  lastMessage: z.string(),
  date: z.date().optional(),
  isRead: z.boolean().optional(),
});
