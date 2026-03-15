import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
