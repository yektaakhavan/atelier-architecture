"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  budgetOptions,
  contactMethods,
  contactSchema,
  isContactErrorKey,
  projectTypeOptions,
  type ContactFormInput,
  type ContactFormValues,
} from "@/features/contact/schema";
import { submitContactRequest, type ContactResult } from "@/services/contact";
import { Select, TextInput, Textarea } from "./controls";
import { Field, fieldA11y } from "./field";

type ContactFormProps = {
  /** Injectable so tests and a future real backend can replace the demo service. */
  onSubmit?: (values: ContactFormValues) => Promise<ContactResult>;
};

const defaultValues: ContactFormInput = {
  name: "",
  email: "",
  subject: "",
  projectType: "",
  budget: "",
  preferredContact: "email",
  phone: "",
  message: "",
};

export function ContactForm({ onSubmit = submitContactRequest }: ContactFormProps) {
  const t = useTranslations("Contact");
  const categories = useTranslations("Projects.categories");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: "onTouched",
  });
  const preferredContact = useWatch({ control, name: "preferredContact" });

  const error = (message?: string) =>
    isContactErrorKey(message) ? t(`errors.${message}`) : undefined;

  async function submit(values: ContactFormValues) {
    // The disabled button already blocks clicks; this also covers a second Enter key press.
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("idle");
    try {
      const result = await onSubmit(values);
      if (result.ok) {
        reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <SuccessMessage
        title={t("successTitle")}
        text={t("successText")}
        action={t("sendAnother")}
        onReset={() => setStatus("idle")}
      />
    );
  }

  const nameField = fieldA11y("contact-name", { error: error(errors.name?.message) });
  const emailField = fieldA11y("contact-email", { error: error(errors.email?.message) });
  const subjectField = fieldA11y("contact-subject", { error: error(errors.subject?.message) });
  const typeField = fieldA11y("contact-type", { error: error(errors.projectType?.message) });
  const budgetField = fieldA11y("contact-budget", {});
  const methodField = fieldA11y("contact-method", {});
  const phoneField = fieldA11y("contact-phone", {
    hint: t("phoneHint"),
    error: error(errors.phone?.message),
  });
  const messageField = fieldA11y("contact-message", {
    hint: t("messageHint"),
    error: error(errors.message?.message),
  });

  return (
    <form
      onSubmit={(event) => void handleSubmit(submit)(event)}
      noValidate
      className="flex flex-col gap-6"
      aria-busy={isSubmitting}
    >
      {status === "error" ? (
        <div role="alert" className="border border-accent-ink p-5">
          <p className="font-medium">{t("errorTitle")}</p>
          <p className="text-sm text-muted">{t("errorText")}</p>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={nameField.id} label={t("name")} error={error(errors.name?.message)}>
          <TextInput autoComplete="name" {...nameField} {...register("name")} />
        </Field>
        <Field id={emailField.id} label={t("email")} error={error(errors.email?.message)}>
          <TextInput
            type="email"
            autoComplete="email"
            dir="ltr"
            className="text-start"
            {...emailField}
            {...register("email")}
          />
        </Field>
      </div>

      <Field id={subjectField.id} label={t("subject")} error={error(errors.subject?.message)}>
        <TextInput {...subjectField} {...register("subject")} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={typeField.id}
          label={t("projectType")}
          error={error(errors.projectType?.message)}
        >
          <Select {...typeField} {...register("projectType")}>
            <option value="">{t("selectPlaceholder")}</option>
            {projectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "other" ? t("projectTypeOther") : categories(option)}
              </option>
            ))}
          </Select>
        </Field>
        <Field id={budgetField.id} label={t("budget")} optionalLabel={t("optional")}>
          <Select {...budgetField} {...register("budget")}>
            <option value="">{t("selectPlaceholder")}</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {t(`budgets.${option}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={methodField.id} label={t("preferredContact")}>
          <Select {...methodField} {...register("preferredContact")}>
            {contactMethods.map((option) => (
              <option key={option} value={option}>
                {t(`methods.${option}`)}
              </option>
            ))}
          </Select>
        </Field>
        {preferredContact === "phone" ? (
          <Field
            id={phoneField.id}
            label={t("phone")}
            hint={t("phoneHint")}
            error={error(errors.phone?.message)}
          >
            <TextInput
              type="tel"
              autoComplete="tel"
              dir="ltr"
              className="text-start"
              {...phoneField}
              {...register("phone")}
            />
          </Field>
        ) : null}
      </div>

      <Field
        id={messageField.id}
        label={t("message")}
        hint={t("messageHint")}
        error={error(errors.message?.message)}
      >
        <Textarea rows={6} {...messageField} {...register("message")} />
      </Field>

      <div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t("sending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}

function SuccessMessage({
  title,
  text,
  action,
  onReset,
}: {
  title: string;
  text: string;
  action: string;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // The submit button that had focus is gone; move focus to the result so it is announced.
  useEffect(() => ref.current?.focus(), []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="animate-rise flex flex-col items-start gap-5 border border-line bg-surface p-8 outline-none"
    >
      <CheckCircle2 aria-hidden className="size-8 text-olive-ink" />
      <h2 className="text-2xl font-medium">{title}</h2>
      <p className="text-muted">{text}</p>
      <Button variant="outline" onClick={onReset}>
        {action}
      </Button>
    </div>
  );
}
