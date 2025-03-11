import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z.string().nonempty("Email is required").email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
  });

export const EventCreationFormSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().date('Invalid date').nonempty("Start Date is required"),
    time: z.string().date('Invalid time').nonempty("Time is required"),
    endDate: z.string().date('Invalid date').nonempty("Date is required"),
    endTime: z.string().date('Invalid time').optional(),
    repeat: z.boolean().optional(),

  });