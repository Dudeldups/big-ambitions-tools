import { FieldError as TFieldError, UseFormRegister } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { _Translator } from "next-intl";
import { EmployeeName } from "@/lib/game/employeeNames";
import { EMPLOYEE_MAX_SALARY } from "@/lib/constants";

type EmployeeSalaryFieldProps = {
  employeeName: EmployeeName;
  register: UseFormRegister<FactoryFormValues>;
  error?: TFieldError;
  t: _Translator;
};

const EmployeeSalaryField = ({
  employeeName,
  register,
  error,
  t,
}: EmployeeSalaryFieldProps) => {
  const fieldName = `employees.${employeeName}Salary` as const;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{t(`employees.${employeeName}`)}</FieldLabel>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          className="max-w-40"
          placeholder="0"
          max={EMPLOYEE_MAX_SALARY}
          aria-invalid={!!error}
          {...register(fieldName, { valueAsNumber: true })}
        />
        <span className="text-muted-foreground">/ hour</span>
      </div>
      {error?.message && <FieldError>{t(error.message)}</FieldError>}
    </Field>
  );
};

export default EmployeeSalaryField;
