import "@/__tests__/mocks/data-table";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import InventoryPage from "./page";
import { ShelfName } from "@/lib/game/inventoryNames";
import { getTableData } from "@/__tests__/helpers/table-page";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";

describe("InventoryPage", () => {
  beforeEach(() => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: true,
      gameVersion: DEFAULT_GAME_VERSION,
    });
  });

  it("renders the data table", () => {
    renderWithIntl(<InventoryPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes correct number of shelves", () => {
    renderWithIntl(<InventoryPage />);
    const data = getTableData(screen);
    expect(data).toHaveLength(
      Object.keys(getGameData(DEFAULT_GAME_VERSION).shelves).length,
    );
  });

  it("passes correct shelf data shape", () => {
    renderWithIntl(<InventoryPage />);
    const data = getTableData(screen);
    const { shelves } = getGameData(DEFAULT_GAME_VERSION);
    const firstShelfName = Object.keys(shelves)[0] as ShelfName;
    const firstShelf = shelves[firstShelfName];

    expect(firstShelf).toBeDefined();
    expect(data[0].itemName).toBe(firstShelfName);
    expect(data[0]).toMatchObject(firstShelf!);
  });
});
