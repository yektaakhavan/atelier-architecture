import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";

const messages = { en, fa };

export function renderWithIntl(ui: ReactElement, { locale = "en" }: { locale?: Locale } = {}) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}
