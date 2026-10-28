import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ContactForm } from "./contact-form";

const copy = en.Contact;

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(copy.name), "Sara Ahmadi");
  await userEvent.type(screen.getByLabelText(copy.email), "sara@example.com");
  await userEvent.type(screen.getByLabelText(copy.subject), "A house on a slope");
  await userEvent.selectOptions(screen.getByLabelText(copy.projectType), "residential");
  await userEvent.type(
    screen.getByLabelText(copy.message),
    "We own a sloping plot and want a small family house.",
  );
}

const submitButton = () =>
  screen.getByRole("button", { name: new RegExp(`${copy.submit}|${copy.sending}`) });

describe("ContactForm", () => {
  it("shows translated errors, focuses the first invalid field and does not submit", async () => {
    const onSubmit = vi.fn();
    renderWithIntl(<ContactForm onSubmit={onSubmit} />);
    await userEvent.click(submitButton());

    expect(await screen.findByText(copy.errors.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.projectTypeRequired)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.messageTooShort)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.name)).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("links each error to its field for assistive technology", async () => {
    renderWithIntl(<ContactForm onSubmit={vi.fn()} />);
    await userEvent.click(submitButton());

    const name = await screen.findByLabelText(copy.name);
    expect(name).toHaveAttribute("aria-invalid", "true");
    const describedBy = name.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)).toHaveTextContent(copy.errors.nameRequired);
  });

  it("submits valid data once and shows the demo-only success message", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    renderWithIntl(<ContactForm onSubmit={onSubmit} />);
    await fillValidForm();
    await userEvent.click(submitButton());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({
      name: "Sara Ahmadi",
      email: "sara@example.com",
      projectType: "residential",
      preferredContact: "email",
    });
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(copy.successTitle);
    expect(status).toHaveTextContent(/not sent to anyone/);
    expect(status).toHaveFocus();
  });

  it("blocks repeat submissions while a request is in flight", async () => {
    let finish!: (result: { ok: true }) => void;
    const onSubmit = vi.fn(() => new Promise<{ ok: true }>((resolve) => (finish = resolve)));
    renderWithIntl(<ContactForm onSubmit={onSubmit} />);
    await fillValidForm();

    await userEvent.click(submitButton());
    expect(await screen.findByRole("button", { name: copy.sending })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: copy.sending }));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    finish({ ok: true });
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("keeps the entries and shows an alert when sending fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false });
    renderWithIntl(<ContactForm onSubmit={onSubmit} />);
    await fillValidForm();
    await userEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(copy.errorTitle);
    expect(screen.getByLabelText(copy.name)).toHaveValue("Sara Ahmadi");
    expect(submitButton()).toBeEnabled();
  });

  it("treats a thrown error like a failed request", async () => {
    renderWithIntl(<ContactForm onSubmit={vi.fn().mockRejectedValue(new Error("network"))} />);
    await fillValidForm();
    await userEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("asks for a phone number only when a phone call is preferred", async () => {
    const onSubmit = vi.fn();
    renderWithIntl(<ContactForm onSubmit={onSubmit} />);
    expect(screen.queryByLabelText(copy.phone)).not.toBeInTheDocument();

    await fillValidForm();
    await userEvent.selectOptions(screen.getByLabelText(copy.preferredContact), "phone");
    await userEvent.click(submitButton());

    expect(await screen.findByText(copy.errors.phoneRequired)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("returns to an empty form after choosing to send another message", async () => {
    renderWithIntl(<ContactForm onSubmit={vi.fn().mockResolvedValue({ ok: true })} />);
    await fillValidForm();
    await userEvent.click(submitButton());
    await userEvent.click(await screen.findByRole("button", { name: copy.sendAnother }));

    expect(screen.getByLabelText(copy.name)).toHaveValue("");
  });

  it("renders labels and errors in Persian", async () => {
    renderWithIntl(<ContactForm onSubmit={vi.fn()} />, { locale: "fa" });
    await userEvent.click(screen.getByRole("button", { name: fa.Contact.submit }));

    expect(screen.getByLabelText(fa.Contact.name)).toBeInTheDocument();
    expect(await screen.findByText(fa.Contact.errors.nameRequired)).toBeInTheDocument();
  });
});
