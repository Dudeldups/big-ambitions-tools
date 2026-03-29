import z from "zod";
import { EMPLOYEE_NAMES, EmployeeName } from "../game/employeeNames";

export type EmployeeSalaryKey = `${EmployeeName}Salary`;

export const employeeSalarySchema = z
  .number("errors.factory.salaryRequired")
  .positive("errors.factory.salaryPositive")
  .int("errors.factory.salaryInteger")
  .max(1000, "errors.factory.salaryTooHigh");

export const employeesSchema = z.object(
  EMPLOYEE_NAMES.reduce(
    (acc, name) => {
      const salaryKey = `${name}Salary` as const;
      acc[salaryKey] = employeeSalarySchema;
      return acc;
    },
    {} as Record<`${EmployeeName}Salary`, typeof employeeSalarySchema>,
  ),
);
