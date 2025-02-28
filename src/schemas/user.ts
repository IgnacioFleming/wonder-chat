import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string(),
  photo: z.string().url().optional(),
  signup_date: z.string().date().optional(),
  last_connection: z.string().date().optional(),
  is_online: z.boolean().optional(),
});
