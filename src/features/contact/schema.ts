import { z } from "zod";
import { projectCategories } from "@/types/content";

export const projectTypeOptions = [...projectCategories, "other"] as const;
export const budgetOptions = ["undecided", "small", "medium", "large"] as const;
export const contactMethods = ["email", "phone"] as const;

/*
 * Error messages are translation keys (Contact.errors.*), not sentences, so the schema
 * stays locale-free and testable; the form translates them when rendering.
 * Selects start as "" so the placeholder option is a real value that fails validation.
 */
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "nameRequired"),
    email: z.string().trim().min(1, "emailRequired").pipe(z.email("emailInvalid")),
    subject: z.string().trim().min(3, "subjectRequired"),
    projectType: z
      .enum(["", ...projectTypeOptions])
      .refine((value) => value !== "", "projectTypeRequired"),
    budget: z.enum(["", ...budgetOptions]),
    preferredContact: z.enum(contactMethods),
    phone: z.string().trim(),
    message: z.string().trim().min(20, "messageTooShort").max(2000, "messageTooLong"),
  })
  .superRefine((values, ctx) => {
    if (values.preferredContact === "phone" && values.phone === "") {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "phoneRequired" });
    }
  });

/** Raw field state (selects may still be ""); ContactFormValues is the validated output. */
export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormValues = z.output<typeof contactSchema>;

export const contactErrorKeys = [
  "nameRequired",
  "emailRequired",
  "emailInvalid",
  "subjectRequired",
  "projectTypeRequired",
  "messageTooShort",
  "messageTooLong",
  "phoneRequired",
] as const;
export type ContactErrorKey = (typeof contactErrorKeys)[number];

export function isContactErrorKey(value: unknown): value is ContactErrorKey {
  return (contactErrorKeys as readonly unknown[]).includes(value);
}
