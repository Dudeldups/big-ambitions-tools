import { FieldError as TFieldError, UseFormRegister } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { EMPLOYEE_MAX_SALARY } from "@/lib/constants";
import { Translator } from "@/lib/types";
import { EmployeeName } from "@/lib/game/employeeNames";
import { useUiStore } from "@/lib/stores/uiStore";

type EmployeeSalaryFieldProps = {
  employeeName: keyof FactoryFormValues["employees"];
  register: UseFormRegister<FactoryFormValues>;
  error?: TFieldError;
  t: Translator;
};

const EmployeeSalaryField = ({
  employeeName,
  register,
  error,
  t,
}: EmployeeSalaryFieldProps) => {
  const isOptimalWorkerChecked = useUiStore((s) => s.isOptimalWorkerChecked);

  const salaryFieldName = `employees.${employeeName}.salary` as const;
  const amountFieldName = `employees.${employeeName}.amount` as const;

  const fixedAmountEmployees: EmployeeName[] = ["hrManager", "deliveryDriver"];
  const isAmountDisabled =
    (employeeName === "factoryWorker" && isOptimalWorkerChecked) ||
    fixedAmountEmployees.includes(employeeName);

  return (
    <FieldSet data-invalid={!!error} className="my-0 w-auto">
      <FieldLegend>{t(`employees.${employeeName}`)}</FieldLegend>

      <div className="flex flex-wrap items-center gap-5">
        <Field className="w-auto">
          <FieldLabel
            htmlFor={`employee-salary-${employeeName}`}
            className="text-muted-foreground"
          >
            Salary
          </FieldLabel>
          <Input
            id={`employee-salary-${employeeName}`}
            type="number"
            className="max-w-20"
            placeholder="0"
            max={EMPLOYEE_MAX_SALARY}
            aria-invalid={!!error}
            {...register(salaryFieldName, {
              setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
            })}
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel
            htmlFor={`employee-amount-${employeeName}`}
            className="text-muted-foreground"
          >
            Amount
          </FieldLabel>
          <Input
            id={`employee-amount-${employeeName}`}
            type="number"
            className="max-w-20"
            placeholder="0"
            disabled={isAmountDisabled}
            aria-invalid={!!error}
            {...register(amountFieldName, {
              setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
            })}
          />
        </Field>
      </div>
      {error?.message && <FieldError>{t(error.message)}</FieldError>}
    </FieldSet>
  );
};

export default EmployeeSalaryField;
