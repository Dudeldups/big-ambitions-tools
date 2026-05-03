"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contactForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { sendContactMessage } from "@/app/[locale]/contact/actions";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("contact");
  const tErrors = useTranslations("errors");
  const tToasts = useTranslations("toasts");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const getError = (field: keyof ContactFormValues) => {
    const message = form.formState.errors[field]?.message;
    return typeof message === "string"
      ? tErrors(`contactForm.${message}`)
      : undefined;
  };

  const nameError = getError("name");
  const emailError = getError("email");
  const messageError = getError("message");

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      const result = await sendContactMessage(formData);

      if (result.success) {
        form.reset();
        toast.success(t("form.success"));
      } else {
        toast.error(tToasts("genericError"));
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-xl max-md:mx-auto"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{t("form.fields.name")}</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            disabled={isPending}
            {...form.register("name")}
          />
          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{t("form.fields.email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            {...form.register("email")}
          />
          {emailError && <FieldError>{emailError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="message">{t("form.fields.message")}</FieldLabel>
          <Textarea
            id="message"
            rows={6}
            disabled={isPending}
            {...form.register("message")}
          />
          {messageError && <FieldError>{messageError}</FieldError>}
        </Field>

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          {...form.register("website")}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ContactForm;
