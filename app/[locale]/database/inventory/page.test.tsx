import "@/__tests__/mocks/data-table";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { shelves } from "@/lib/game/inventory";
import InventoryPage from "./page";
import { ShelfName } from "@/lib/game/inventoryNames";
import { getTableData } from "@/__tests__/helpers/table-page";

describe("InventoryPage", () => {
  it("renders the data table", () => {
    renderWithIntl(<InventoryPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes correct number of shelves", () => {
    renderWithIntl(<InventoryPage />);
    const data = getTableData(screen);
    expect(data).toHaveLength(Object.keys(shelves).length);
  });

  it("passes correct shelf data shape", () => {
    renderWithIntl(<InventoryPage />);
    const data = getTableData(screen);
    const firstShelfName = Object.keys(shelves)[0] as ShelfName;
    const firstShelf = shelves[firstShelfName];

    expect(data[0].itemName).toBe(firstShelfName);
    expect(data[0]).toMatchObject(firstShelf);
  });
});
