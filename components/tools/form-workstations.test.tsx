import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import FormWorkstations from "./form-workstations";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));

const mockTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as Translator;

vi.mock("./workstation-selects", () => ({
  default: ({ index }: { index: number }) => (
    <div data-testid="workstation-selects">{`workstation-${index}`}</div>
  ),
}));

vi.mock("./workstation-preset-dialog", () => ({
  default: () => <div data-testid="workstation-preset-dialog" />,
}));

function FormWorkstationsHarness({
  defaultValues = _testFactoryFormValues,
  onFormReady,
}: {
  defaultValues?: FactoryFormValues;
  onFormReady?: (form: UseFormReturn<FactoryFormValues>) => void;
}) {
  const form = useForm<FactoryFormValues>({ defaultValues });

  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return <FormWorkstations form={form} t={mockTranslator} />;
}

describe("FormWorkstations", () => {
  beforeEach(() => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "normal",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });
  });

  it("appends a new workstation with a matching default product", async () => {
    const user = userEvent.setup();
    let formRef: UseFormReturn<FactoryFormValues> | undefined;

    renderWithIntl(
      <FormWorkstationsHarness
        onFormReady={(form) => {
          formRef = form;
        }}
      />,
    );

    expect(screen.getAllByTestId("workstation-selects")).toHaveLength(2);
    expect(screen.getByTestId("workstation-preset-dialog")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "tools.factoryPlanner.workstations.addBtn",
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("workstation-selects")).toHaveLength(3);
    });

    const newWorkstation = formRef?.getValues().workstations.at(-1);
    const gameData = getGameData(DEFAULT_GAME_VERSION);

    expect(newWorkstation).toMatchObject({
      amount: 1,
      name: "clothingWorkstation",
    });
    expect(
      newWorkstation && gameData.products[newWorkstation.product]?.workstation,
    ).toBe("clothingWorkstation");
  });
});
