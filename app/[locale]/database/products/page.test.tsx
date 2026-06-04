import "@/__tests__/mocks/data-table";

import { renderWithIntl, screen } from "@/__tests__/test-utils";
import ProductsPage from "./page";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";
import { getTableData } from "@/__tests__/helpers/table-page";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";

describe("ProductsPage", () => {
  beforeEach(() => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: true,
      gameVersion: DEFAULT_GAME_VERSION,
    });
  });

  it("renders the data table", () => {
    renderWithIntl(<ProductsPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes the correct number of products", () => {
    renderWithIntl(<ProductsPage />);
    const { products } = getGameData(DEFAULT_GAME_VERSION);
    expect(screen.getByTestId("row-count")).toHaveTextContent(
      String(Object.keys(products).length),
    );
  });

  it("passes undefined profit data when difficulty is unavailable", () => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: true,
      gameVersion: DEFAULT_GAME_VERSION,
      difficulty: undefined,
    });
    renderWithIntl(<ProductsPage />);

    const data = getTableData(screen);

    expect(data[0].profitPerHour).toBeNull();
    expect(data[0].margin).toBeUndefined();
    expect(data[0].marginPercent).toBeUndefined();
  });
});
