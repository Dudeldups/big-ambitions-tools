import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { getMissingPalletShelvesTotal } from "@/lib/calculations/getMissingPalletShelvesTotal";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { mergeShoppingLists } from "@/lib/utils/mergeShoppingLists";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";
import GroupShoppingListDialog from "./group-shopping-list-dialog";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));

vi.mock("@/lib/calculations/getMissingPalletShelvesTotal", () => ({
  getMissingPalletShelvesTotal: vi.fn(),
}));

vi.mock("@/lib/calculations/getOptimalPalletShelfAmount", () => ({
  getOptimalPalletShelfAmount: vi.fn(),
}));

vi.mock("@/lib/utils/getShoppingList", () => ({
  getShoppingList: vi.fn(),
}));

vi.mock("@/lib/utils/splitShoppingListByShelves", () => ({
  splitShoppingListByShelves: vi.fn(),
}));

vi.mock("@/lib/utils/mergeShoppingLists", () => ({
  mergeShoppingLists: vi.fn(),
}));

vi.mock("@/lib/hooks/useRichDefaults", () => ({
  useRichDefaults: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "tools.factoryGroups.shoppingList.title": "Shopping list",
        "general.close": "Close",
      };

      return translations[key] ?? key;
    },
    rich: (_key: string, values?: { amount?: number }) =>
      `Need ${values?.amount ?? 0} pallet shelves`,
  })),
}));

vi.mock("../tables/importer-table", () => ({
  default: ({
    data,
  }: {
    data: {
      importer: string;
      items: Array<{ name: string; amount: number }>;
    };
  }) => (
    <div data-testid={`importer-${data.importer}`}>
      {data.items.map((item) => `${item.name}:${item.amount}`).join(",")}
    </div>
  ),
}));

describe("GroupShoppingListDialog", () => {
  it("renders nothing when no active playthrough is available", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    renderWithIntl(<GroupShoppingListDialog factoryIds={["factory-a"]} />);

    expect(
      screen.queryByRole("button", { name: /shopping list/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the merged external shopping list for the selected factories", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Morgan",
      difficulty: "hard",
      gameVersion: "0.10",
    });
    const bakery = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Bakery",
      shelfAmount: 4,
    });
    const pharmacy = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Pharmacy",
      shelfAmount: 4,
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, bakery.id);
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, pharmacy.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    vi.mocked(getMissingPalletShelvesTotal).mockReturnValue(3);
    vi.mocked(getOptimalPalletShelfAmount).mockReturnValue({ external: 6 });
    vi.mocked(getShoppingList).mockImplementation((factory) => [
      {
        importer: `${factory.name}-importer`,
        items: [{ name: "water", amount: 10, value: 100 }],
      },
    ]);
    vi.mocked(splitShoppingListByShelves).mockImplementation(
      (shoppingList) => ({
        factoryList: [],
        externalList: shoppingList,
      }),
    );
    vi.mocked(mergeShoppingLists).mockReturnValue([
      {
        importer: "combined-importer",
        items: [{ name: "water", amount: 20, value: 200 }],
      },
    ]);

    renderWithIntl(
      <GroupShoppingListDialog factoryIds={[bakery.id, pharmacy.id]} />,
    );

    const trigger = screen.getByRole("button", { name: /shopping list/i });
    expect(trigger).not.toHaveClass("hidden");

    await user.click(trigger);

    expect(
      screen.getByRole("heading", { name: /shopping list/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Need 3 pallet shelves")).toBeInTheDocument();
    expect(screen.getByTestId("importer-combined-importer")).toHaveTextContent(
      "water:20",
    );
    expect(mergeShoppingLists).toHaveBeenCalledWith([
      {
        importer: "Bakery-importer",
        items: [{ name: "water", amount: 10, value: 100 }],
      },
      {
        importer: "Pharmacy-importer",
        items: [{ name: "water", amount: 10, value: 100 }],
      },
    ]);
  });

  it("keeps the trigger hidden when no shelves are missing", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "normal",
      gameVersion: "0.10",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Covered Factory",
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    vi.mocked(getMissingPalletShelvesTotal).mockReturnValue(0);
    vi.mocked(getOptimalPalletShelfAmount).mockReturnValue({ external: 0 });
    vi.mocked(getShoppingList).mockReturnValue([]);
    vi.mocked(splitShoppingListByShelves).mockReturnValue({
      factoryList: [],
      externalList: [],
    });
    vi.mocked(mergeShoppingLists).mockReturnValue([]);

    renderWithIntl(<GroupShoppingListDialog factoryIds={[factory.id]} />);

    expect(screen.getByRole("button", { name: /shopping list/i })).toHaveClass(
      "hidden",
    );
  });
});
