import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { useAppStore } from "@/lib/stores/appStore";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import FormInformation from "./form-information";

const mockTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as Translator;

vi.mock("./pallet-shelf-field", () => ({
  PalletShelfField: () => <div data-testid="pallet-shelf-field" />,
}));

function FormInformationHarness({
  defaultValues = _testFactoryFormValues,
  onFormReady,
}: {
  defaultValues?: FactoryFormValues;
  onFormReady?: (form: UseFormReturn<FactoryFormValues>) => void;
}) {
  const form = useForm<FactoryFormValues>({ defaultValues });
  const openingHours = form.watch("openingHours");

  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return (
    <FormInformation
      form={form}
      openingHours={openingHours}
      t={mockTranslator}
    />
  );
}

describe("FormInformation", () => {
  it("caps opening hours at 24", async () => {
    const user = userEvent.setup();

    renderWithIntl(<FormInformationHarness />);

    const openingHoursInput = screen.getByLabelText(
      "general.openingHours / general.day",
    );

    await user.clear(openingHoursInput);
    await user.type(openingHoursInput, "30");

    await waitFor(() => {
      expect(openingHoursInput).toHaveValue(24);
    });
  });

  it("updates the app calculation period through the radio group", async () => {
    const user = userEvent.setup();
    useAppStore.setState({ _hasHydrated: true, calculationPeriod: "weekly" });

    renderWithIntl(<FormInformationHarness />);

    await user.click(
      screen.getByLabelText("general.calculationPeriodOptions.daily"),
    );

    expect(useAppStore.getState().calculationPeriod).toBe("daily");
  });
});
