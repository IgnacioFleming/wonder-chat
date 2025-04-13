import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string(),
  password: z.string(),
  photo: z.string().url().optional(),
  signup_date: z.string().date().optional(),
  last_connection: z.string().date().optional(),
  is_online: z.boolean().optional(),
});
