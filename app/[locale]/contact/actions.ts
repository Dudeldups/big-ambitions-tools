"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/lib/schemas/contactForm";

type ContactActionResult = {
  success: boolean;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const emailAddress = process.env.RESEND_EMAIL;

export async function sendContactMessage(
  formData: FormData,
): Promise<ContactActionResult> {
  if (!process.env.RESEND_API_KEY || !emailAddress) {
    console.error("Missing email config");
    return { success: false };
  }

  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  const { name, email, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: "Big Ambitions Tools <noreply@big-ambitions-tools.com>",
    to: emailAddress,
    subject: `Contact form: ${name}`,
    replyTo: email,
    text: `New contact form message

Name: ${name}
Email: ${email}

Message:
${message}
`,
  });

  if (error) {
    console.error("Resend error:", error);
    return { success: false };
  }

  return { success: true };
}
