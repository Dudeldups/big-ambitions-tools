import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import de from "@/messages/de.json";
import nl from "@/messages/nl.json";
import GroupShoppingListDialog from "./group-shopping-list-dialog";
import GroupDeliveriesDialog from "./group-deliveries-dialog";
import { PalletShelfField } from "./pallet-shelf-field";
import FactoryPage from "@/app/[locale]/tools/[playthroughId]/factories/[factoryId]/page";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("@/i18n/navigation", () => import("@/__tests__/mocks/i18n-navigation"));
vi.mock("../tables/importer-table", () => ({ default: () => <div /> }));
vi.mock("../tables/deliveries-table", () => ({ default: () => <div /> }));

function setupFactory(purchasingAgent = 0) {
  const store = usePlaythroughStore.getState();
  const playthrough = store.createPlaythrough({
    characterName: "Morgan",
    difficulty: "normal",
    gameVersion: "1.0",
  });
  const factory = store.createFactory({
    ..._testFactoryFormValues,
    shelfAmount: 9,
    openingHours: 24,
    employees: {
      ..._testFactoryFormValues.employees,
      purchasingAgent: { amount: purchasingAgent, salary: 80 },
    },
    workstations: [{ name: "foodWorkstation", product: "hotdog", amount: 25 }],
  });
  store.addFactoryToPlaythrough(playthrough.id, factory.id);
  usePlaythroughStore.setState({ _hasHydrated: true });
  setMockParams({ playthroughId: playthrough.id, factoryId: factory.id });
  return factory;
}

function PalletShelfHarness() {
  const form = useForm<FactoryFormValues>({
    defaultValues: _testFactoryFormValues,
  });
  return <PalletShelfField control={form.control} errors={{}} />;
}

describe.each([
  { locale: "de", messages: de },
  { locale: "nl", messages: nl },
])("warehouse purchasing copy in $locale", ({ locale, messages }) => {
  it("localizes the group shopping instructions and warehouse shelf label", async () => {
    const user = userEvent.setup();
    const factory = setupFactory();
    renderWithIntl(<GroupShoppingListDialog factoryIds={[factory.id]} />, {
      locale,
      messagesOverride: messages,
    });
    await user.click(
      screen.getByRole("button", {
        name: messages.tools.factoryGroups.shoppingList.title,
      }),
    );
    expect(
      screen.getByText(messages.tools.factoryGroups.warehouseShoppingDesc, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.tools.factoryGroups.warehouseShelvesLabel, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("localizes the daily delivery instructions and warehouse shelf label", async () => {
    const user = userEvent.setup();
    const factory = setupFactory();
    renderWithIntl(<GroupDeliveriesDialog factoryIds={[factory.id]} />, {
      locale,
      messagesOverride: messages,
    });
    await user.click(
      screen.getByRole("button", {
        name: messages.tools.factoryGroups.deliveries.buttonDesc,
      }),
    );
    expect(
      screen.getByText(messages.tools.factoryGroups.warehouseDeliveryDesc, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.tools.factoryGroups.warehouseShelvesLabel, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it.each([
    { amount: 0, key: "centralPurchasingNote" as const },
    { amount: 1, key: "splitPurchasingNote" as const },
  ])(
    "localizes the factory purchasing note with $amount agents",
    ({ amount, key }) => {
      setupFactory(amount);
      renderWithIntl(<FactoryPage />, { locale, messagesOverride: messages });
      expect(
        screen.getByText(messages.tools.factoryDetail[key]),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: messages.tools.factoryDetail.shoppingList.title,
        }),
      ).toBeInTheDocument();
    },
  );

  it("localizes the physical shelf explanation in the factory form", () => {
    setupFactory();
    renderWithIntl(<PalletShelfHarness />, {
      locale,
      messagesOverride: messages,
    });
    expect(
      screen.getByText(messages.tools.factoryPlanner.information.palletDesc),
    ).toBeInTheDocument();
  });
});
