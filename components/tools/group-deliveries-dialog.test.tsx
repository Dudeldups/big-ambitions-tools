import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { getMissingPalletShelvesTotal } from "@/lib/calculations/getMissingPalletShelvesTotal";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import GroupDeliveriesDialog from "./group-deliveries-dialog";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));

vi.mock("@/lib/calculations/getMissingPalletShelvesTotal", () => ({
  getMissingPalletShelvesTotal: vi.fn(),
}));

vi.mock("@/lib/utils/getShoppingList", () => ({
  getShoppingList: vi.fn(),
}));

vi.mock("../details", () => ({
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section data-testid={`details-${title}`}>
      <h3>{title}</h3>
      {children}
    </section>
  ),
}));

vi.mock("../tables/deliveries-table", () => ({
  default: ({
    deliveryList,
  }: {
    deliveryList: Array<{ name: string; amount: number }>;
  }) => (
    <div data-testid="deliveries-table">
      {deliveryList.map((item) => `${item.name}:${item.amount}`).join(",")}
    </div>
  ),
}));

describe("GroupDeliveriesDialog", () => {
  it("renders nothing when no active playthrough is available", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    renderWithIntl(<GroupDeliveriesDialog factoryIds={["factory-a"]} />);

    expect(
      screen.queryByRole("button", { name: /deliveries/i }),
    ).not.toBeInTheDocument();
  });

  it("shows daily consumption for every factory regardless of its pallet shelves", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    const bakery = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Bakery",
      shelfAmount: 0,
    });
    const pharmacy = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Pharmacy",
      shelfAmount: 8,
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, bakery.id);
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, pharmacy.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    vi.mocked(getMissingPalletShelvesTotal).mockReturnValue(5);
    vi.mocked(getShoppingList).mockImplementation((factory) => [
      {
        importer: `${factory.name}-importer`,
        items: [
          {
            name: "water",
            amount: factory.name === "Bakery" ? 70 : 35,
            value: 100,
          },
        ],
      },
    ]);

    renderWithIntl(
      <GroupDeliveriesDialog factoryIds={[bakery.id, pharmacy.id]} />,
    );

    const trigger = screen.getByRole("button", { name: /deliveries/i });
    expect(trigger).not.toHaveClass("hidden");

    await user.click(trigger);

    expect(
      screen.getByRole("heading", { name: /delivery plan/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /pallet shelves needed for the warehouse.s weekly ingredients/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("details-Bakery")).toBeInTheDocument();
    expect(screen.getByTestId("details-Pharmacy")).toBeInTheDocument();
    expect(screen.getAllByTestId("deliveries-table")[0]).toHaveTextContent(
      "water:10",
    );
    expect(screen.getAllByTestId("deliveries-table")[1]).toHaveTextContent(
      "water:5",
    );
  });

  it("keeps the trigger hidden when no shelves are missing", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "normal",
      gameVersion: DEFAULT_GAME_VERSION,
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
    vi.mocked(getShoppingList).mockReturnValue([]);

    renderWithIntl(<GroupDeliveriesDialog factoryIds={[factory.id]} />);

    expect(screen.getByRole("button", { name: /deliveries/i })).toHaveClass(
      "hidden",
    );
  });
});
