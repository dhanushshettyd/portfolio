import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters for your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200, "Email must be 200 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters in your message.")
    .max(2000, "Message must be 2,000 characters or fewer."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;