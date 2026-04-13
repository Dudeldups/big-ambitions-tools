"use client";

import { EmployeeName } from "@/lib/game/employeeNames";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import EmployeeSalaryField from "./employee-salary-field";
import { Translator } from "@/lib/types";
import { UseFormRegister } from "react-hook-form";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useUiStore } from "@/lib/stores/uiStore";

type FormEmployeesProps = {
  register: UseFormRegister<FactoryFormValues>;
  t: Translator;
};

const factoryEmployees = [
  "deliveryDriver",
  "hrManager",
  "logisticsManager",
  "purchasingAgent",
  "factoryWorker",
] as const satisfies readonly EmployeeName[];

const FormEmployees = ({ register, t }: FormEmployeesProps) => {
  const isOptimalWorkerChecked = useUiStore((s) => s.isOptimalWorkerChecked);
  const toggleOptimalWorker = useUiStore((s) => s.toggleOptimalWorker);

  return (
    <FieldSet className="@container/field-set px-4">
      <div className="flex justify-between gap-4">
        <div>
          <FieldLegend>Employees</FieldLegend>
          <FieldDescription className="text-muted-foreground">
            Enter the salary for each employee.
          </FieldDescription>
        </div>

        <Field orientation="horizontal" className="w-auto self-start">
          <Checkbox
            id="factory-worker-check"
            checked={isOptimalWorkerChecked}
            onCheckedChange={() => toggleOptimalWorker()}
          />
          <FieldLabel htmlFor="factory-worker-check">
            Use optimal factory worker amount
          </FieldLabel>
        </Field>
      </div>

      <FieldGroup className="grid grid-cols-(--grid-cols-form) gap-6 px-4">
        {factoryEmployees.map((employee) => (
          <EmployeeSalaryField
            key={employee}
            employeeName={employee}
            register={register}
            t={t}
          />
        ))}
      </FieldGroup>
    </FieldSet>
  );
};

export default FormEmployees;
