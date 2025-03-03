import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z.string().nonempty("Email is required").email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
  });