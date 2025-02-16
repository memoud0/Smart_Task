import { z } from "zod";
import { LoginFormSchema } from "@/app/schema";

export type LoginFormInput = z.infer<typeof LoginFormSchema>;

