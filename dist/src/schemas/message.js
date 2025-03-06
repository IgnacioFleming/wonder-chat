import { z } from "zod";
export const messageSchema = z.object({
    author: z.string(),
    content: z.string(),
    receiver: z.string(),
    date: z.string().optional(),
    isSent: z.boolean().optional(),
    isRead: z.boolean().optional(),
});
