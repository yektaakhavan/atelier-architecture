import type { ContactFormValues } from "@/features/contact/schema";
import { submitContactRequest } from "./contact";

const values: ContactFormValues = {
  name: "Sara",
  email: "sara@example.com",
  subject: "Hello",
  projectType: "residential",
  budget: "",
  preferredContact: "email",
  phone: "",
  message: "A message that is comfortably long enough to pass validation.",
};

describe("submitContactRequest (demo)", () => {
  it("succeeds for a normal request", async () => {
    await expect(submitContactRequest(values, { delayMs: 0 })).resolves.toEqual({ ok: true });
  });

  it("simulates a failure for @error.example addresses", async () => {
    await expect(
      submitContactRequest({ ...values, email: "x@ERROR.example" }, { delayMs: 0 }),
    ).resolves.toEqual({
      ok: false,
    });
  });
});
