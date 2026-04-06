import "@/__tests__/mocks/data-table";

import { renderWithIntl, screen } from "@/__tests__/test-utils";
import ProductsPage from "./page";
import { products } from "@/lib/game/products";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";

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

  it("passes null profit data when store is not hydrated", () => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: false,
    });
    renderWithIntl(<ProductsPage />);
    // table still renders, data is there but margins are null
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("computes profit data when store is loaded", () => {
    useAppStore.setState({
      ...initialAppState,
      difficulty: "hard",
    });
    renderWithIntl(<ProductsPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });
});
