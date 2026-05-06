import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { products } from "@/lib/game/products";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import FormWorkstations from "./form-workstations";

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

  return <FormWorkstations form={form} t={(key: string) => key as never} />;
}

describe("FormWorkstations", () => {
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

    expect(newWorkstation).toMatchObject({
      amount: 1,
      name: "clothingWorkstation",
    });
    expect(
      newWorkstation && products[newWorkstation.product].workstation,
    ).toBe("clothingWorkstation");
  });
});
