import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import EmpireOverview from "./empire-overview";

const derivedMocks = vi.hoisted(() => ({
  deriveProductData: vi.fn(),
}));

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("@/lib/calculations/derivedFactoryData", () => derivedMocks);
vi.mock("../tables/shared-table-columns", () => ({
  createColumnWithImage: vi.fn(() => ({ id: "itemName" })),
  createNumericColumn: vi.fn(() => ({ id: "amount" })),
}));
vi.mock("../tables/data-table", () => ({
  DataTable: ({
    data,
  }: {
    data: Array<{ itemName: string; amount: number }>;
  }) => (
    <div data-testid="empire-table">
      {data.map((row) => `${row.itemName}:${row.amount}`).join(",")}
    </div>
  ),
}));
vi.mock("../no-data-found", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="no-data">{text}</div>
  ),
}));

describe("EmpireOverview", () => {
  it("renders nothing without an active playthrough", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-playthrough" });

    const { container } = renderWithIntl(<EmpireOverview />);

    expect(container).toBeEmptyDOMElement();
  });

  it("aggregates product data from the active playthrough factories only", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
      gameVersion: "0.10",
    });
    const bakery = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Bakery",
    });
    const pharmacy = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Pharmacy",
    });
    usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Ignored Factory",
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, bakery.id);
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, pharmacy.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    derivedMocks.deriveProductData.mockImplementation((factory) => {
      if (factory.name === "Bakery") {
        return [
          { name: "products.burger", amount: 10, value: 100 },
          { name: "products.sodaCan", amount: 4, value: 40 },
        ];
      }

      if (factory.name === "Pharmacy") {
        return [{ name: "products.burger", amount: 5, value: 60 }];
      }

      return [{ name: "products.umbrella", amount: 99, value: 999 }];
    });

    renderWithIntl(<EmpireOverview className="test-class" />);

    expect(screen.getByText("Weekly production overview")).toBeInTheDocument();
    expect(screen.getByTestId("empire-table")).toHaveTextContent(
      "burger:15,sodaCan:4",
    );
    expect(screen.getByTestId("empire-table")).not.toHaveTextContent(
      "umbrella",
    );
    expect(derivedMocks.deriveProductData).toHaveBeenCalledTimes(2);
  });

  it("shows the empty state when no production data is available", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "normal",
      gameVersion: "0.10",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Quiet Factory",
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });
    derivedMocks.deriveProductData.mockReturnValue([]);

    renderWithIntl(<EmpireOverview />);

    expect(screen.getByTestId("no-data")).toHaveTextContent(
      "No data available yet. Create factories and you'll see your production stats here.",
    );
  });
});
