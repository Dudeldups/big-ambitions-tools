import "@/__tests__/mocks/data-table";

import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";

import IngredientsPage from "./page";

describe("IngredientsPage", () => {
  it("renders the data table", () => {
    renderWithIntl(<IngredientsPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes the correct number of ingredients", () => {
    renderWithIntl(<IngredientsPage />);
    const expectedCount = Object.keys(
      getGameData(DEFAULT_GAME_VERSION).ingredients,
    ).length;
    expect(screen.getByTestId("row-count")).toHaveTextContent(
      String(expectedCount),
    );
  });
});
