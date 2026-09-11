import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen, within } from "@/__tests__/test-utils";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import FactoryOverview from "./factory-overview";

const derivedMocks = vi.hoisted(() => ({
  derivePalletShelfData: vi.fn(),
  deriveVehicleData: vi.fn(),
  deriveWorkstationData: vi.fn(),
  deriveEmployeeData: vi.fn(),
  deriveIngredientData: vi.fn(),
  deriveProductData: vi.fn(),
}));

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("@/lib/calculations/derivedFactoryData", () => derivedMocks);
vi.mock("./overview-table-wrapper", () => ({
  default: ({
    title,
    label,
    rowData,
  }: {
    title: string;
    label: string;
    rowData: unknown[];
  }) => (
    <div data-testid={`overview-${title}`}>
      <span>{title}</span>
      <span>{label}</span>
      <span>{rowData.length}</span>
    </div>
  ),
}));

describe("FactoryOverview", () => {
  it("renders nothing without an active playthrough", () => {
    useAppStore.setState({ _hasHydrated: true, calculationPeriod: "weekly" });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-playthrough" });

    const { container } = renderWithIntl(
      <FactoryOverview values={_testFactoryFormValues} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders overview sections and summary values from derived data", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    useAppStore.setState({ _hasHydrated: true, calculationPeriod: "weekly" });
    setMockParams({ playthroughId: playthrough.id });

    derivedMocks.derivePalletShelfData.mockReturnValue([
      { name: "inventory.palletShelf", amount: 1, value: 100 },
    ]);
    derivedMocks.deriveVehicleData.mockReturnValue([
      { name: "vehicles.FreightTruckT1", amount: 1, value: 200 },
    ]);
    derivedMocks.deriveWorkstationData.mockReturnValue([
      { name: "machines.clothingWorkstation", amount: 2, value: 700 },
    ]);
    derivedMocks.deriveEmployeeData.mockReturnValue([
      { name: "employees.factoryWorker", amount: 20, value: 300 },
    ]);
    derivedMocks.deriveIngredientData.mockReturnValue([
      { name: "ingredients.fabricCheap", amount: 1, value: 200 },
    ]);
    derivedMocks.deriveProductData.mockReturnValue([
      { name: "products.classicCheapMaleClothing", amount: 1, value: 2000 },
    ]);

    renderWithIntl(<FactoryOverview values={_testFactoryFormValues} />);

    expect(screen.getByTestId("overview-One-time costs")).toHaveTextContent(
      "3",
    );
    expect(
      screen.getByTestId("overview-Recurring costs (weekly)"),
    ).toHaveTextContent("2");
    expect(screen.getByTestId("overview-Revenue (weekly)")).toHaveTextContent(
      "1",
    );

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("$2,000.00")).toBeInTheDocument();
    expect(screen.getByText("$500.00")).toBeInTheDocument();
    expect(screen.getByText("$1,500.00")).toBeInTheDocument();
    expect(screen.getByText("$450.00")).toBeInTheDocument();
    expect(screen.getByText("$1,050.00")).toBeInTheDocument();
    expect(screen.getByText("7 days")).toBeInTheDocument();
    expect(screen.getByText("Tax-deductible expenses")).toBeInTheDocument();
    expect(screen.getByText("Taxable income")).toBeInTheDocument();
    expect(
      screen.getByText(
        "In version 1.0, ingredients and employee wages reduce taxable income. Factory equipment, pallet shelves, and qualifying delivery vehicles are deductible when purchased, but one-time deductions are not included in this recurring tax estimate.",
      ),
    ).toBeInTheDocument();
  });

  it("shows never when the factory would not amortize", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "hard",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    useAppStore.setState({ _hasHydrated: true, calculationPeriod: "weekly" });
    setMockParams({ playthroughId: playthrough.id });

    derivedMocks.derivePalletShelfData.mockReturnValue([
      { name: "inventory.palletShelf", amount: 1, value: 100 },
    ]);
    derivedMocks.deriveVehicleData.mockReturnValue([]);
    derivedMocks.deriveWorkstationData.mockReturnValue([]);
    derivedMocks.deriveEmployeeData.mockReturnValue([
      { name: "employees.factoryWorker", amount: 20, value: 1000 },
    ]);
    derivedMocks.deriveIngredientData.mockReturnValue([]);
    derivedMocks.deriveProductData.mockReturnValue([
      { name: "products.classicCheapMaleClothing", amount: 1, value: 500 },
    ]);

    renderWithIntl(<FactoryOverview values={_testFactoryFormValues} />);

    const taxableIncomeRow = screen.getByText("Taxable income").parentElement;
    expect(taxableIncomeRow).not.toBeNull();
    expect(within(taxableIncomeRow!).getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText("Never")).toBeInTheDocument();
  });

  it("keeps recurring factory expenses non-deductible before version 1.0", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Morgan",
      difficulty: "hard",
      gameVersion: "0.11",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    useAppStore.setState({ _hasHydrated: true, calculationPeriod: "weekly" });
    setMockParams({ playthroughId: playthrough.id });

    derivedMocks.derivePalletShelfData.mockReturnValue([]);
    derivedMocks.deriveVehicleData.mockReturnValue([]);
    derivedMocks.deriveWorkstationData.mockReturnValue([]);
    derivedMocks.deriveEmployeeData.mockReturnValue([
      { name: "employees.factoryWorker", amount: 20, value: 300 },
    ]);
    derivedMocks.deriveIngredientData.mockReturnValue([
      { name: "ingredients.fabricCheap", amount: 1, value: 200 },
    ]);
    derivedMocks.deriveProductData.mockReturnValue([
      { name: "products.classicCheapMaleClothing", amount: 1, value: 2000 },
    ]);

    renderWithIntl(<FactoryOverview values={_testFactoryFormValues} />);

    const taxableIncomeRow = screen.getByText("Taxable income").parentElement;
    expect(taxableIncomeRow).not.toBeNull();
    expect(
      within(taxableIncomeRow!).getByText("$2,000.00"),
    ).toBeInTheDocument();
    expect(screen.getByText("$600.00")).toBeInTheDocument();
    expect(screen.getByText("$900.00")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(
      screen.queryByText("Tax-deductible expenses"),
    ).not.toBeInTheDocument();
  });
});
