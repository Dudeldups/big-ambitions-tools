import { renderWithIntl, screen } from "@/__tests__/test-utils";
import IngredientsPage from "./page";
import { ingredients } from "@/lib/game/ingredients";

vi.mock("@/components/tables/data-table", () => ({
  DataTable: ({ data, columns }: { data: unknown[]; columns: unknown[] }) => (
    <div data-testid="data-table">
      <span data-testid="row-count">{data.length}</span>
      <span data-testid="column-count">{columns.length}</span>
    </div>
  ),
}));

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
