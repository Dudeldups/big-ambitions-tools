"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/lib/schemas/contactForm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  const { name, email, message } = parsed.data;

  try {
    await resend.emails.send({
      from: "Big Ambitions Tools <noreply@big-ambitions-tools.com>",
      to: "info@big-ambitions-tools.com",
      subject: `Contact form: ${name}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
