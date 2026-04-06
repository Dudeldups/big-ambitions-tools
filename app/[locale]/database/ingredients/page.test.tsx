import "@/__tests__/mocks/data-table";

import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { ingredients } from "@/lib/game/ingredients";

import IngredientsPage from "./page";

describe("IngredientsPage", () => {
  it("renders the data table", () => {
    renderWithIntl(<IngredientsPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes the correct number of ingredients", () => {
    renderWithIntl(<IngredientsPage />);
    const expectedCount = Object.keys(ingredients).length;
    expect(screen.getByTestId("row-count")).toHaveTextContent(
      String(expectedCount),
    );
  });
});
