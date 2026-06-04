import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useUiStore } from "@/lib/stores/uiStore";
import { Translator } from "@/lib/types";
import { useForm } from "react-hook-form";
import EmployeeSalaryField from "./employee-salary-field";

const mockTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as Translator;

function EmployeeSalaryFieldHarness({
  employeeName,
}: {
  employeeName: keyof FactoryFormValues["employees"];
}) {
  const form = useForm<FactoryFormValues>();

  return (
    <EmployeeSalaryField
      employeeName={employeeName}
      register={form.register}
      t={mockTranslator}
    />
  );
}

describe("EmployeeSalaryField", () => {
  it("disables the factory worker amount when optimal workers are enabled", () => {
    useUiStore.setState({ isOptimalWorkerChecked: true });

    renderWithIntl(<EmployeeSalaryFieldHarness employeeName="factoryWorker" />);

    expect(screen.getByLabelText("general.amount")).toBeDisabled();
  });

  it("always disables fixed-amount employee fields", () => {
    renderWithIntl(
      <EmployeeSalaryFieldHarness employeeName="deliveryDriver" />,
    );

    expect(screen.getByLabelText("general.amount")).toBeDisabled();
  });

  it("keeps non-fixed employee amounts editable", () => {
    useUiStore.setState({ isOptimalWorkerChecked: false });

    renderWithIntl(
      <EmployeeSalaryFieldHarness employeeName="logisticsManager" />,
    );

    expect(screen.getByLabelText("general.amount")).toBeEnabled();
  });
});
