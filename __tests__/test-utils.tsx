import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

type Options = {
  locale?: string;
  messagesOverride?: Record<string, unknown>;
} & Omit<RenderOptions, "wrapper">;

function AllProviders({
  children,
  locale = "en",
  messagesOverride,
}: {
  children: React.ReactNode;
  locale?: string;
  messagesOverride?: Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messagesOverride ?? messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}

export function renderWithIntl(
  ui: ReactElement,
  { locale, messagesOverride, ...options }: Options = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders locale={locale} messagesOverride={messagesOverride}>
        {children}
      </AllProviders>
    ),
    ...options,
  });
}
