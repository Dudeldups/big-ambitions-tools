import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import Home from "./page";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      title: "Home",
      description: "Welcome",
    };

    return messages[key] ?? key;
  },
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

test("renders the home page", () => {
  render(<Home />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toBeDefined();
});
