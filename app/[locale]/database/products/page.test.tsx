import "@/__tests__/mocks/data-table";

import { renderWithIntl, screen } from "@/__tests__/test-utils";
import ProductsPage from "./page";
import { products } from "@/lib/game/products";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";
import { getTableData } from "@/__tests__/helpers/table-page";

describe("ProductsPage", () => {
  it("renders the data table", () => {
    renderWithIntl(<ProductsPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes the correct number of products", () => {
    renderWithIntl(<ProductsPage />);
    expect(screen.getByTestId("row-count")).toHaveTextContent(
      String(Object.keys(products).length),
    );
  });

  it("passes undefined profit data when store is not hydrated", () => {
    useAppStore.setState({ ...initialAppState, difficulty: undefined });
    renderWithIntl(<ProductsPage />);

    const data = getTableData(screen);

    expect(data[0].profitPerHour).toBeNull();
    expect(data[0].margin).toBeUndefined();
    expect(data[0].marginPercent).toBeUndefined();
  });
});
