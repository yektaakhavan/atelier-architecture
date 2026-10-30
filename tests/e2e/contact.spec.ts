import { expect, test } from "@playwright/test";

async function fillValid(page: import("@playwright/test").Page, email = "sara@example.com") {
  await page.getByLabel("Your name").fill("Sara Ahmadi");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Subject").fill("A house on a slope");
  await page.getByLabel("Project type").selectOption("residential");
  await page
    .getByLabel("Message")
    .fill("We own a sloping plot and would like to talk about a small family house.");
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/contact");
  });

  test("explains every invalid field and focuses the first one", async ({ page }) => {
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please choose a project type.")).toBeVisible();
    await expect(page.getByLabel("Your name")).toBeFocused();
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
  });

  test("validates the email format and the message length", async ({ page }) => {
    await fillValid(page, "not-an-email");
    await page.getByLabel("Message").fill("too short");
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("That email address does not look right.")).toBeVisible();
    await expect(page.getByText(/at least 20 characters/)).toBeVisible();
  });

  test("asks for a phone number only when a call is preferred", async ({ page }) => {
    await expect(page.getByLabel("Phone number")).toHaveCount(0);
    await fillValid(page);
    await page.getByLabel("Preferred way to reply").selectOption("phone");
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("Please enter a phone number or choose email.")).toBeVisible();
  });

  test("shows progress, blocks repeat submits and ends with an honest demo message", async ({
    page,
  }) => {
    await fillValid(page);
    await page.getByRole("button", { name: "Send request" }).click();

    const sending = page.getByRole("button", { name: "Sending…" });
    await expect(sending).toBeDisabled();

    const result = page.getByRole("status");
    await expect(result).toContainText("Thank you, message received (demo)");
    await expect(result).toContainText("not sent to anyone");

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel("Your name")).toHaveValue("");
  });

  test("keeps the entries and reports a failure", async ({ page }) => {
    await fillValid(page, "visitor@error.example");
    await page.getByRole("button", { name: "Send request" }).click();

    // Next.js ships its own role="alert" route announcer, so match ours by content.
    await expect(page.getByRole("alert").filter({ hasText: "Something went wrong" })).toBeVisible();
    await expect(page.getByLabel("Your name")).toHaveValue("Sara Ahmadi");
    await expect(page.getByRole("button", { name: "Send request" })).toBeEnabled();
  });

  test("can be completed with the keyboard alone", async ({ page }) => {
    await page.getByLabel("Your name").focus();
    await page.keyboard.type("Sara Ahmadi");
    await page.keyboard.press("Tab");
    await page.keyboard.type("sara@example.com");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Hello");
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown"); // first option after the placeholder
    await page.keyboard.press("Tab"); // budget
    await page.keyboard.press("Tab"); // preferred contact
    await page.keyboard.press("Tab"); // message
    await page.keyboard.type("A message that is comfortably long enough to be valid.");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page.getByRole("status")).toContainText("Thank you");
  });
});
