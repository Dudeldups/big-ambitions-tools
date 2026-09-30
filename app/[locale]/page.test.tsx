import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import en from "@/messages/en.json";
import { renderWithIntl, screen, within } from "@/__tests__/test-utils";
import HomePage from "./page";
import { updateHistory } from "@/lib/updateHistory";

describe("HomePage", () => {
  it("renders the page title", () => {
    renderWithIntl(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the game website link", () => {
    renderWithIntl(<HomePage />);
    const link = screen.getByRole("link", { name: /Hovgaard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("bigambitionsgame.com"),
    );
  });

  it("renders the Steam link", () => {
    renderWithIntl(<HomePage />);
    const link = screen.getByRole("link", { name: /steam/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("store.steampowered.com"),
    );
  });

  it("renders the update history list", () => {
    renderWithIntl(<HomePage />);

    const updatesHeading = screen.getByRole("heading", {
      name: /updates/i,
      level: 2,
    });
    const updatesSection = updatesHeading.closest("section")!;
    expect(within(updatesSection).getAllByRole("list")[0]).toBeInTheDocument();
  });

  it("renders all update history items", () => {
    renderWithIntl(<HomePage />);

    const updatesSection = screen
      .getByRole("heading", { name: /updates/i, level: 2 })
      .closest("section")!;

    const list = within(updatesSection).getAllByRole("list")[0];
    const items = within(list)
      .getAllByRole("listitem")
      .filter((item) => item.parentElement === list);
    expect(items.length).toBe(updateHistory.length);
  });
});

const messageDirectory = join(process.cwd(), "messages");
const catalogues = readdirSync(messageDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    locale: file.replace(".json", ""),
    messages: JSON.parse(
      readFileSync(join(messageDirectory, file), "utf8"),
    ) as typeof en,
  }));

describe("September 30 update notice", () => {
  it.each(catalogues)(
    "renders the translated notice, date and contributor links in $locale",
    ({ locale, messages }) => {
      renderWithIntl(<HomePage />, { locale, messagesOverride: messages });
      const section = screen
        .getByRole("heading", { name: messages.home.updates.title, level: 2 })
        .closest("section")!;
      const list = within(section).getAllByRole("list")[0];
      const entry = within(list).getAllByRole("listitem")[0];
      const date = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(new Date("2026-09-30"));
      expect(within(entry).getByText(date)).toHaveAttribute(
        "datetime",
        "2026-09-30",
      );
      expect(within(entry).getAllByRole("listitem")).toHaveLength(3);
      expect(entry).toHaveTextContent(
        messages.updateHistory.update13.replace(/<[^>]+>/g, ""),
      );
      expect(within(entry).getByRole("link", { name: "#1" })).toHaveAttribute(
        "href",
        "https://github.com/Dudeldups/big-ambitions-tools/pull/1",
      );
      expect(within(entry).getByRole("link", { name: "#2" })).toHaveAttribute(
        "href",
        "https://github.com/Dudeldups/big-ambitions-tools/pull/2",
      );
      const contributors = within(entry).getAllByRole("link", {
        name: "@FusRoDev",
      });
      expect(contributors).toHaveLength(2);
      contributors.forEach((link) =>
        expect(link).toHaveAttribute("href", "https://github.com/FusRoDev"),
      );
    },
  );
});
