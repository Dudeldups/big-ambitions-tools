import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useUiStore } from "@/lib/stores/uiStore";
import FormEmployees from "./form-employees";

vi.mock("./employee-salary-field", () => ({
  default: ({
    employeeName,
  }: {
    employeeName: string;
  }) => <div data-testid={`employee-field-${employeeName}`}>{employeeName}</div>,
}));

vi.mock("../ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function FormEmployeesHarness() {
  const { register } = useForm<FactoryFormValues>();

  return (
    <FormEmployees
      register={register}
      t={(key: string) => key}
    />
  );
}

describe("FormEmployees", () => {
  it("renders the expected employee salary fields", () => {
    renderWithIntl(<FormEmployeesHarness />);

    expect(screen.getByTestId("employee-field-deliveryDriver")).toBeInTheDocument();
    expect(screen.getByTestId("employee-field-hrManager")).toBeInTheDocument();
    expect(screen.getByTestId("employee-field-logisticsManager")).toBeInTheDocument();
    expect(screen.getByTestId("employee-field-purchasingAgent")).toBeInTheDocument();
    expect(screen.getByTestId("employee-field-factoryWorker")).toBeInTheDocument();
  });

  it("toggles the optimal worker checkbox through the ui store", async () => {
    const user = userEvent.setup();
    useUiStore.setState({ isOptimalWorkerChecked: true });

    renderWithIntl(<FormEmployeesHarness />);

    const checkbox = screen.getByLabelText(
      "tools.factoryPlanner.employees.optimalWorkers",
    );
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(useUiStore.getState().isOptimalWorkerChecked).toBe(false);

    await user.click(checkbox);
    expect(useUiStore.getState().isOptimalWorkerChecked).toBe(true);
  });
});
