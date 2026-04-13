import { FieldError as TFieldError, UseFormRegister } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { EMPLOYEE_MAX_SALARY } from "@/lib/constants";
import { Translator } from "@/lib/types";
import { EmployeeName } from "@/lib/game/employeeNames";
import { Label } from "../ui/label";

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
  const salaryFieldName = `employees.${employeeName}.salary` as const;
  const amountFieldName = `employees.${employeeName}.amount` as const;

  const fixedAmountEmployees: EmployeeName[] = ["hrManager", "deliveryDriver"];

  return (
    <Field data-invalid={!!error} className="my-0">
      <FieldLabel htmlFor={`employee-${employeeName}`}>
        {t(`employees.${employeeName}`)}
      </FieldLabel>
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-3">
          <Input
            id={`employee-${employeeName}`}
            type="number"
            className="max-w-20"
            placeholder="0"
            max={EMPLOYEE_MAX_SALARY}
            aria-invalid={!!error}
            {...register(salaryFieldName, {
              setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
            })}
          />
          <span className="text-muted-foreground">/ hour</span>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor={`employee-amount-${employeeName}`}
            className="text-muted-foreground"
          >
            Amount:
          </Label>
          <Input
            id={`employee-amount-${employeeName}`}
            type="number"
            className="max-w-20"
            placeholder="0"
            disabled={fixedAmountEmployees.includes(employeeName)}
            aria-invalid={!!error}
            {...register(amountFieldName, {
              setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
            })}
          />
        </div>
      </div>
      {error?.message && <FieldError>{t(error.message)}</FieldError>}
    </Field>
  );
};

export default EmployeeSalaryField;
