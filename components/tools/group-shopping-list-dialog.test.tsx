import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen, within } from "@/__tests__/test-utils";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { getGameData } from "@/lib/game/registry";
import {
  DEFAULT_GAME_VERSION,
  GAME_VERSIONS,
  GameVersion,
} from "@/lib/game/versions";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { ImporterShoppingList } from "@/lib/utils/getShoppingList";
import GroupDeliveriesDialog from "./group-deliveries-dialog";
import GroupShoppingListDialog from "./group-shopping-list-dialog";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("@/i18n/navigation", () => import("@/__tests__/mocks/i18n-navigation"));

// Keep the shopping, storage and delivery calculations real.
vi.mock("../tables/importer-table", () => ({
  default: ({ data }: { data: ImporterShoppingList }) => (
    <div data-testid={`importer-${data.importer}`}>
      {data.items.map((item) => (
        <div
          key={item.name}
          data-testid={`ingredient-${item.name}`}
          data-amount={item.amount}
          data-value={item.value}
        >
          {item.name}:{item.amount}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../details", () => ({
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => <section aria-label={title}>{children}</section>,
}));

vi.mock("../tables/deliveries-table", () => ({
  default: ({
    deliveryList,
  }: {
    deliveryList: Array<{ name: string; amount: number }>;
  }) => (
    <div>
      {deliveryList.map((item) => (
        <div key={item.name} data-testid={`delivery-${item.name}`}>
          {item.name}:{item.amount}
        </div>
      ))}
    </div>
  ),
}));

const withPurchasingAgent = (
  amount: number,
): Pick<FactoryFormValues, "employees"> => ({
  employees: {
    ..._testFactoryFormValues.employees,
    purchasingAgent: {
      ..._testFactoryFormValues.employees.purchasingAgent,
      amount,
    },
  },
});

const setupFactories = (
  factories: Partial<FactoryFormValues>[],
  gameVersion: GameVersion = DEFAULT_GAME_VERSION,
) => {
  const store = usePlaythroughStore.getState();
  const playthrough = store.createPlaythrough({
    characterName: "Morgan",
    difficulty: "normal",
    gameVersion,
  });
  const factoryIds = factories.map((overrides, index) => {
    const factory = store.createFactory({
      ..._testFactoryFormValues,
      name: `Factory ${index + 1}`,
      openingHours: 24,
      shelfAmount: 9,
      workstations: [
        { name: "foodWorkstation", product: "hotdog", amount: 25 },
      ],
      ...overrides,
    });
    store.addFactoryToPlaythrough(playthrough.id, factory.id);
    return factory.id;
  });

  usePlaythroughStore.setState({ _hasHydrated: true });
  setMockParams({ playthroughId: playthrough.id });
  return factoryIds;
};

const expectIngredient = (name: string, amount: number, value: number) => {
  const row = screen.getByTestId(`ingredient-${name}`);
  expect(Number(row.getAttribute("data-amount"))).toBe(amount);
  expect(Number(row.getAttribute("data-value"))).toBeCloseTo(value);
};

describe("GroupShoppingListDialog", () => {
  it("renders nothing when no active playthrough is available", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    renderWithIntl(<GroupShoppingListDialog factoryIds={["factory-a"]} />);

    expect(
      screen.queryByRole("button", { name: /group shopping list/i }),
    ).not.toBeInTheDocument();
  });

  describe.each(GAME_VERSIONS)("game version %s", (gameVersion) => {
    it.each([0, 9, 20])(
      "orders all seven days of ingredients with %i shelves per factory",
      async (shelfAmount) => {
        const user = userEvent.setup();
        const factoryIds = setupFactories(
          [{ shelfAmount }, { shelfAmount }],
          gameVersion,
        );
        const factory = usePlaythroughStore
          .getState()
          .getFactoryById(factoryIds[0])!;
        // Nine shelves hold exactly one day; 63 hold a full week.
        expect(
          getOptimalPalletShelfAmount(
            factory.workstations,
            getGameData(gameVersion),
          ),
        ).toMatchObject({ daily: 9, external: 63 });

        renderWithIntl(<GroupShoppingListDialog factoryIds={factoryIds} />);
        await user.click(
          screen.getByRole("button", { name: /group shopping list/i }),
        );

        // Per factory: 25 workstations * 24 hours * 7 days.
        // Hourly inputs per workstation: 200 sausages, 200 dough, 50 tomatoes.
        expect(screen.getAllByTestId("importer-lunartide")).toHaveLength(1);
        expectIngredient("rawSausage", 1680000, 299880);
        expectIngredient("dough", 1680000, 485100);
        expectIngredient("tomato", 420000, 63945);
      },
    );
  });

  it("includes the full weekly demand of a factory with enough shelves and skips missing factory IDs", async () => {
    const user = userEvent.setup();
    const factoryIds = setupFactories([
      { shelfAmount: 0 },
      { shelfAmount: 63 },
    ]);

    renderWithIntl(
      <GroupShoppingListDialog
        factoryIds={[...factoryIds, "deleted-factory"]}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: /group shopping list/i }),
    );

    expectIngredient("rawSausage", 1680000, 299880);
    expectIngredient("dough", 1680000, 485100);
    expectIngredient("tomato", 420000, 63945);
  });

  it("respects each factory's opening hours and weekly production limit", async () => {
    const user = userEvent.setup();
    const factoryIds = setupFactories([
      { openingHours: 12 },
      {
        openingHours: 10,
        workstations: [
          {
            name: "foodWorkstation",
            product: "hotdog",
            amount: 25,
            productionLimit: 1000,
          },
        ],
      },
    ]);

    renderWithIntl(<GroupShoppingListDialog factoryIds={factoryIds} />);
    await user.click(
      screen.getByRole("button", { name: /group shopping list/i }),
    );

    // First factory: 420,000 hotdogs/week; second factory capped at 1,000.
    expectIngredient("rawSausage", 421000, 75148.5);
    expectIngredient("dough", 421000, 121563.75);
    expectIngredient("tomato", 105250, 16024.3125);
  });

  it("keeps weekly purchasing and daily deliveries consistent with minimum factory shelves", async () => {
    const user = userEvent.setup();
    const factoryIds = setupFactories([
      {},
      {
        shelfAmount: 18,
        workstations: [
          { name: "foodWorkstation", product: "hotdog", amount: 50 },
        ],
      },
    ]);

    renderWithIntl(
      <>
        <GroupShoppingListDialog factoryIds={factoryIds} />
        <GroupDeliveriesDialog factoryIds={factoryIds} />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: /group shopping list/i }),
    );

    expectIngredient("rawSausage", 2520000, 449820);
    expectIngredient("dough", 2520000, 727650);
    expectIngredient("tomato", 630000, 95917.5);

    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /^deliveries$/i }));

    const firstFactory = within(
      screen.getByRole("region", { name: "Factory 1" }),
    );
    const secondFactory = within(
      screen.getByRole("region", { name: "Factory 2" }),
    );
    expect(firstFactory.getByTestId("delivery-rawSausage")).toHaveTextContent(
      "rawSausage:120000",
    );
    expect(firstFactory.getByTestId("delivery-dough")).toHaveTextContent(
      "dough:120000",
    );
    expect(firstFactory.getByTestId("delivery-tomato")).toHaveTextContent(
      "tomato:30000",
    );
    expect(secondFactory.getByTestId("delivery-rawSausage")).toHaveTextContent(
      "rawSausage:240000",
    );
    expect(secondFactory.getByTestId("delivery-dough")).toHaveTextContent(
      "dough:240000",
    );
    expect(secondFactory.getByTestId("delivery-tomato")).toHaveTextContent(
      "tomato:60000",
    );
  });

  it("keeps the trigger hidden when a separate buyer handles the entire order", () => {
    const factoryIds = setupFactories([
      { shelfAmount: 63, ...withPurchasingAgent(1) },
    ]);

    renderWithIntl(<GroupShoppingListDialog factoryIds={factoryIds} />);

    expect(
      screen.getByRole("button", { name: /group shopping list/i }),
    ).toHaveClass("hidden");
  });

  it("combines mixed purchasing strategies and delivers only each factory's warehouse share", async () => {
    const user = userEvent.setup();
    const factoryIds = setupFactories([
      { ...withPurchasingAgent(0) },
      { ...withPurchasingAgent(1) },
    ]);
    renderWithIntl(
      <>
        <GroupShoppingListDialog factoryIds={factoryIds} />
        <GroupDeliveriesDialog factoryIds={factoryIds} />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: /group shopping list/i }),
    );
    expectIngredient("rawSausage", 1560000, 278460);
    expectIngredient("dough", 1560000, 450450);
    expectIngredient("tomato", 390000, 59377.5);
    expect(screen.getByText("117")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /^deliveries$/i }));
    expect(
      within(screen.getByRole("region", { name: "Factory 1" })).getByTestId(
        "delivery-rawSausage",
      ),
    ).toHaveTextContent("rawSausage:120000");
    expect(
      within(screen.getByRole("region", { name: "Factory 2" })).getByTestId(
        "delivery-rawSausage",
      ),
    ).toHaveTextContent("rawSausage:102858");
  });

  it("keeps warehouse purchasing available for centrally supplied factories with enough local shelves", async () => {
    const user = userEvent.setup();
    const factoryIds = setupFactories([
      { shelfAmount: 63, ...withPurchasingAgent(0) },
    ]);
    renderWithIntl(<GroupShoppingListDialog factoryIds={factoryIds} />);
    const button = screen.getByRole("button", { name: /group shopping list/i });
    expect(button).not.toHaveClass("hidden");
    await user.click(button);
    expectIngredient("rawSausage", 840000, 149940);
    expect(screen.getByText("63")).toBeInTheDocument();
  });
});
