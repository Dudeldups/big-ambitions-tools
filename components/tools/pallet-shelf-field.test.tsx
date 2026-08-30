import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useForm } from "react-hook-form";
import { PalletShelfField } from "./pallet-shelf-field";

const palletShelfMocks = vi.hoisted(() => ({
  getOptimalPalletShelfAmounts: vi.fn(),
}));

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock(
  "@/lib/calculations/getOptimalPalletShelfAmount",
  () => palletShelfMocks,
);
vi.mock("../ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/lib/hooks/useRichDefaults", () => ({
  useRichDefaults: () => ({
    t: (key: string, values?: Record<string, unknown>) => {
      if (key === "counts.palletShelf") {
        return `${values?.count} pallet shelves`;
      }

      const translations: Record<string, string> = {
        "general.palletShelves": "Pallet shelves",
        "tools.factoryPlanner.information.palletDesc":
          "Define how many pallet shelves are available in this factory. Set this to 0 to order all ingredients to the warehouse group instead.",
        "tools.factoryPlanner.information.shelfExplanation":
          "Add at least one workstation to see the required number of pallet shelves.",
        "tools.factoryPlanner.information.enoughWeekly":
          "Enough for weekly delivery.",
        "tools.factoryPlanner.information.enoughDaily":
          "Enough for daily delivery only. A warehouse is required for weekly logistics.",
        "tools.factoryPlanner.information.notEnough":
          "Not enough storage even for daily delivery.",
        "tools.factoryPlanner.information.overflowWarning": "Stock piling up!",
        "tools.factoryPlanner.information.overflowDesc":
          "Production outpaces ingredient consumption. Shelf count adjusted accordingly.",
      };

      return translations[key] ?? key;
    },
    rich: (key: string, values?: Record<string, unknown>) => {
      if (key === "tools.factoryPlanner.information.dailyAmount") {
        return `Daily delivery requires ${values?.count} ${values?.object}.`;
      }
      if (key === "tools.factoryPlanner.information.weeklyAmount") {
        return `Weekly delivery requires ${values?.count} ${values?.object}.`;
      }
      if (key === "tools.factoryPlanner.information.limitedWeeklyAmount") {
        return `With production limits, weekly delivery requires ${values?.count} ${values?.object}.`;
      }
      return key;
    },
  }),
}));

function PalletShelfFieldHarness({
  shelfAmount = 50,
  workstations = _testFactoryFormValues.workstations,
}: {
  shelfAmount?: number;
  workstations?: FactoryFormValues["workstations"];
}) {
  const form = useForm<FactoryFormValues>({
    defaultValues: {
      ..._testFactoryFormValues,
      shelfAmount,
      workstations,
    },
  });

  return (
    <PalletShelfField control={form.control} errors={form.formState.errors} />
  );
}

describe("PalletShelfField", () => {
  beforeEach(() => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "normal",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });
  });

  it("normalizes leading zeros in the shelf amount input", async () => {
    const user = userEvent.setup();
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 1,
        weekly: 2,
        external: 2,
        isOverflowing: false,
      },
      limited: null,
    });

    renderWithIntl(<PalletShelfFieldHarness shelfAmount={5} />);

    const input = screen.getByLabelText("Pallet shelves");

    await user.clear(input);
    await user.type(input, "007");

    await waitFor(() => {
      expect(input).toHaveValue(7);
    });
  });

  it("allows zero shelves when all ingredients are ordered to the warehouse group", () => {
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 1,
        weekly: 2,
        external: 2,
        isOverflowing: false,
      },
      limited: null,
    });

    renderWithIntl(<PalletShelfFieldHarness shelfAmount={0} />);

    expect(screen.getByLabelText("Pallet shelves")).toHaveValue(0);
    expect(screen.getByLabelText("Pallet shelves")).toHaveAttribute("min", "0");
    expect(
      screen.getByText(
        "Define how many pallet shelves are available in this factory. Set this to 0 to order all ingredients to the warehouse group instead.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the shelf explanation when no workstation-based shelves are needed yet", () => {
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 0,
        weekly: 0,
        external: 0,
        isOverflowing: false,
      },
      limited: null,
    });

    renderWithIntl(<PalletShelfFieldHarness />);

    expect(
      screen.getByText(
        "Add at least one workstation to see the required number of pallet shelves.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the weekly success state when enough shelves are available", () => {
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 4,
        weekly: 10,
        external: 10,
        isOverflowing: false,
      },
      limited: null,
    });

    renderWithIntl(<PalletShelfFieldHarness shelfAmount={12} />);

    expect(
      screen.getByText("Daily delivery requires 4 4 pallet shelves."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Weekly delivery requires 10 10 pallet shelves."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enough for weekly delivery.")).toBeInTheDocument();
  });

  it("shows overflow and daily-only warnings when weekly capacity is not enough", () => {
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 4,
        weekly: 10,
        external: 10,
        isOverflowing: true,
      },
      limited: null,
    });

    renderWithIntl(<PalletShelfFieldHarness shelfAmount={5} />);

    expect(screen.getByText("Stock piling up!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enough for daily delivery only. A warehouse is required for weekly logistics.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the limited weekly shelf estimate when production limits are active", () => {
    palletShelfMocks.getOptimalPalletShelfAmounts.mockReturnValue({
      full: {
        daily: 4,
        weekly: 10,
        external: 10,
        isOverflowing: false,
      },
      limited: {
        daily: 2,
        weekly: 6,
        external: 6,
        isOverflowing: false,
      },
    });

    renderWithIntl(
      <PalletShelfFieldHarness
        workstations={[
          {
            ..._testFactoryFormValues.workstations[0],
            productionLimit: 100,
          },
        ]}
      />,
    );

    expect(
      screen.getByText(
        "With production limits, weekly delivery requires 6 6 pallet shelves.",
      ),
    ).toBeInTheDocument();
  });
});
