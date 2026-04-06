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
    const { getByRole } = within(updatesSection);

    expect(getByRole("list")).toBeInTheDocument();
  });

  it("renders all update history items", () => {
    renderWithIntl(<HomePage />);

    const updatesSection = screen
      .getByRole("heading", { name: /updates/i, level: 2 })
      .closest("section")!;

    const items = within(updatesSection).getAllByRole("listitem");
    expect(items.length).toBe(updateHistory.length);
  });
});
