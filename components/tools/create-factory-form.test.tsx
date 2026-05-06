import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, waitFor, within } from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { useUiStore } from "@/lib/stores/uiStore";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import CreateFactoryForm from "./create-factory-form";

vi.mock("./form-information", () => ({
  default: ({ form }: { form: UseFormReturn<FactoryFormValues> }) => (
    <div data-testid="form-information">
      <label htmlFor="factory-name">Factory name</label>
      <input id="factory-name" {...form.register("name")} />
    </div>
  ),
}));

vi.mock("./form-employees", () => ({
  default: () => <div data-testid="form-employees" />,
}));

vi.mock("./form-vehicles", () => ({
  default: () => <div data-testid="form-vehicles" />,
}));

vi.mock("./form-workstations", () => ({
  default: () => <div data-testid="form-workstations" />,
}));

function FactoryFormHarness({
  defaultValues = _testFactoryFormValues,
  onSubmit = vi.fn(),
  onCancel = vi.fn(),
  onFormReady,
}: {
  defaultValues?: FactoryFormValues;
  onSubmit?: (values: FactoryFormValues) => void;
  onCancel?: () => void;
  onFormReady?: (form: UseFormReturn<FactoryFormValues>) => void;
}) {
  const form = useForm<FactoryFormValues>({
    defaultValues,
  });

  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return <CreateFactoryForm form={form} onSubmit={onSubmit} onCancel={onCancel} />;
}

describe("CreateFactoryForm", () => {
  it("disables the optimal worker toggle on mount", () => {
    useUiStore.setState({ isOptimalWorkerChecked: true });

    renderWithIntl(<FactoryFormHarness />);

    expect(useUiStore.getState().isOptimalWorkerChecked).toBe(false);
  });

  it("submits the current form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithIntl(<FactoryFormHarness onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Factory name"));
    await user.type(screen.getByLabelText("Factory name"), "Updated Factory");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        ..._testFactoryFormValues,
        name: "Updated Factory",
      }),
    );
  });

  it("calls onCancel after confirming the cancel dialog", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithIntl(<FactoryFormHarness onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText("Discard unsaved changes"),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Confirm" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("resets edited values after confirming the reset dialog", async () => {
    const user = userEvent.setup();

    renderWithIntl(<FactoryFormHarness />);

    const nameInput = screen.getByLabelText("Factory name");

    await user.clear(nameInput);
    await user.type(nameInput, "Changed Name");
    expect(nameInput).toHaveValue("Changed Name");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Reset form values")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Factory name")).toHaveValue(
        _testFactoryFormValues.name,
      );
    });
  });
});
