import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import FormVehicles from "./form-vehicles";

const mockTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as Translator;

vi.mock("./vehicle-select", () => ({
  default: ({ index }: { index: number }) => (
    <div data-testid="vehicle-select">{`vehicle-${index}`}</div>
  ),
}));

function FormVehiclesHarness({
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

  return <FormVehicles control={form.control} t={mockTranslator} />;
}

describe("FormVehicles", () => {
  it("appends a second default vehicle and hides the add button at the limit", async () => {
    const user = userEvent.setup();
    let formRef: UseFormReturn<FactoryFormValues> | undefined;

    renderWithIntl(
      <FormVehiclesHarness
        onFormReady={(form) => {
          formRef = form;
        }}
      />,
    );

    expect(screen.getAllByTestId("vehicle-select")).toHaveLength(1);

    await user.click(
      screen.getByRole("button", {
        name: "tools.factoryPlanner.vehicles.addBtn",
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("vehicle-select")).toHaveLength(2);
    });

    expect(formRef?.getValues().vehicles).toHaveLength(2);
    expect(formRef?.getValues().vehicles[1]).toEqual({
      name: "FreightTruckT1",
    });
    expect(
      screen.queryByRole("button", {
        name: "tools.factoryPlanner.vehicles.addBtn",
      }),
    ).not.toBeInTheDocument();
  });
});
