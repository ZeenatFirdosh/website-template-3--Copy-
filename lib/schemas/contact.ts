import { z } from "zod";

export const contactFormSchema = z.object({
  email: z.email("A valid email address is required."),
  message: z.string().min(1, "Message is required."),
  name: z.string().min(1, "Name is required."),
  phone: z
    .string()
    .transform((v) => v || undefined)
    .optional(),
  subject: z.string().min(1, "Subject is required."),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
