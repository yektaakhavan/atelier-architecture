import { contactSchema, type ContactFormInput } from "./schema";

const valid: ContactFormInput = {
  name: "Sara Ahmadi",
  email: "sara@example.com",
  subject: "A house on a slope",
  projectType: "residential",
  budget: "",
  preferredContact: "email",
  phone: "",
  message: "We own a sloping plot and would like to talk about a small family house.",
};

function messagesFor(input: Partial<ContactFormInput>) {
  const result = contactSchema.safeParse({ ...valid, ...input });
  return result.success
    ? []
    : result.error.issues.map((issue) => `${issue.path.join(".")}:${issue.message}`);
}

describe("contactSchema", () => {
  it("accepts a complete request", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const result = contactSchema.parse({ ...valid, name: "  Sara  ", email: " sara@example.com " });
    expect(result.name).toBe("Sara");
    expect(result.email).toBe("sara@example.com");
  });

  it("reports a missing name, subject and project type with translation keys", () => {
    expect(messagesFor({ name: "", subject: "", projectType: "" })).toEqual(
      expect.arrayContaining([
        "name:nameRequired",
        "subject:subjectRequired",
        "projectType:projectTypeRequired",
      ]),
    );
  });

  it("distinguishes an empty email from an invalid one", () => {
    expect(messagesFor({ email: "" })).toContain("email:emailRequired");
    expect(messagesFor({ email: "not-an-email" })).toContain("email:emailInvalid");
  });

  it("enforces message length limits", () => {
    expect(messagesFor({ message: "too short" })).toContain("message:messageTooShort");
    expect(messagesFor({ message: "x".repeat(2001) })).toContain("message:messageTooLong");
  });

  it("keeps the budget optional", () => {
    expect(messagesFor({ budget: "" })).toEqual([]);
    expect(messagesFor({ budget: "large" })).toEqual([]);
  });

  it("requires a phone number only when a phone call is preferred", () => {
    expect(messagesFor({ preferredContact: "phone", phone: "" })).toContain("phone:phoneRequired");
    expect(messagesFor({ preferredContact: "phone", phone: "+1 555 010 0100" })).toEqual([]);
    expect(messagesFor({ preferredContact: "email", phone: "" })).toEqual([]);
  });

  it("rejects an unknown project type", () => {
    expect(contactSchema.safeParse({ ...valid, projectType: "spaceship" }).success).toBe(false);
  });
});
