import { act, renderWithIntl, screen } from "@/__tests__/test-utils";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { GAME_VERSIONS, GameVersion } from "@/lib/game/versions";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { ImporterShoppingList } from "@/lib/utils/getShoppingList";
import EmpireOverview from "./empire-overview";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("../tables/data-table", () => ({ DataTable: () => <div /> }));
vi.mock("../tables/importer-table", () => ({
  default: ({ data }: { data: ImporterShoppingList }) => (
    <section data-testid={`importer-${data.importer}`}>
      {data.items.map((item) => (
        <div
          key={item.name}
          data-testid={`ingredient-${item.name}`}
          data-amount={item.amount}
          data-value={item.value}
        />
      ))}
    </section>
  ),
}));

const setup = (
  factories: Partial<FactoryFormValues>[],
  gameVersion: GameVersion = "1.0",
) => {
  const store = usePlaythroughStore.getState();
  const playthrough = store.createPlaythrough({
    characterName: "Morgan",
    difficulty: "normal",
    gameVersion,
  });
  const ids = factories.map((overrides, index) => {
    const factory = store.createFactory({
      ..._testFactoryFormValues,
      name: `Factory ${index}`,
      openingHours: 24,
      shelfAmount: 63,
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
  return { ids, playthrough };
};

describe("empire weekly shopping list", () => {
  it.each(GAME_VERSIONS)(
    "totals active factories once across mixed buyers and factory groups in game %s",
    (version) => {
      const { ids, playthrough } = setup(
        [
          {},
          {
            employees: {
              ..._testFactoryFormValues.employees,
              purchasingAgent: { amount: 1, salary: 80 },
            },
          },
        ],
        version,
      );
      const store = usePlaythroughStore.getState();
      store.createFactory(_testFactoryFormValues);
      const group = store.createFactoryGroup(playthrough.id, { name: "Group" });
      ids.forEach((id) =>
        store.addFactoryToGroup(playthrough.id, id, group.id),
      );
      renderWithIntl(<EmpireOverview />);
      expect(screen.getAllByTestId("importer-lunartide")).toHaveLength(1);
      for (const [name, amount, value] of [
        ["rawSausage", 1680000, 299880],
        ["dough", 1680000, 485100],
        ["tomato", 420000, 63945],
      ] as const) {
        expect(screen.getByTestId(`ingredient-${name}`)).toHaveAttribute(
          "data-amount",
          String(amount),
        );
        expect(
          Number(
            screen.getByTestId(`ingredient-${name}`).getAttribute("data-value"),
          ),
        ).toBeCloseTo(value);
      }
    },
  );

  it("updates weekly quantities for opening hours and production limits", () => {
    const { ids } = setup([{}]);
    renderWithIntl(<EmpireOverview />);
    act(() =>
      usePlaythroughStore.getState().editFactory(ids[0], { openingHours: 12 }),
    );
    expect(screen.getByTestId("ingredient-rawSausage")).toHaveAttribute(
      "data-amount",
      "420000",
    );
    act(() =>
      usePlaythroughStore.getState().editFactory(ids[0], {
        workstations: [
          {
            name: "foodWorkstation",
            product: "hotdog",
            amount: 25,
            productionLimit: 1000,
          },
        ],
      }),
    );
    expect(screen.getByTestId("ingredient-rawSausage")).toHaveAttribute(
      "data-amount",
      "1000",
    );
  });

  it.each([
    { factories: [] },
    {
      factories: [
        {
          workstations: [
            {
              name: "foodWorkstation",
              product: "hotdog",
              amount: 25,
              productionLimit: 0,
            },
          ],
        },
      ],
    },
  ] satisfies { factories: Partial<FactoryFormValues>[] }[])(
    "hides the shopping list when weekly demand is zero ($factories)",
    ({ factories }) => {
      setup(factories);
      renderWithIntl(<EmpireOverview />);
      expect(
        screen.queryByTestId("importer-lunartide"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Weekly Shopping List"),
      ).not.toBeInTheDocument();
    },
  );
});
