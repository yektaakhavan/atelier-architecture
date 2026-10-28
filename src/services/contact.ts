import type { ContactFormValues } from "@/features/contact/schema";

export type ContactResult = { ok: true } | { ok: false };

/*
 * Demo implementation: nothing leaves the browser. Swap the body for a fetch() to a real
 * endpoint and keep the signature; the form only depends on ContactResult.
 * To see the error state, use an email ending in @error.example.
 */
export async function submitContactRequest(
  values: ContactFormValues,
  { delayMs = 900 }: { delayMs?: number } = {},
): Promise<ContactResult> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (values.email.toLowerCase().endsWith("@error.example")) return { ok: false };
  return { ok: true };
}
