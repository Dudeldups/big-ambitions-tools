import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(80, "nameTooLong"),

  email: z.email("invalidEmail").max(120, "invalidEmail"),

  message: z
    .string()
    .trim()
    .min(1, "messageRequired")
    .max(3000, "messageTooLong"),

  website: z.string().optional(), // honeypot
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
