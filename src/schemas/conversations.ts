import { z } from "zod";

export const lastMessageSchema = z.object({
  content: z.string(),
  author: z.string(),
  date: z.date().optional(),
  isRead: z.boolean().optional(),
});

export const conversationSchema = z.object({
  participants: z.array(z.string()),
  lastMessage: lastMessageSchema,
});
