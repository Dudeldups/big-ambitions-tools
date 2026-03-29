import z from "zod";
import { EMPLOYEE_MAX_SALARY } from "../constants";
import { EmployeeName } from "../game/employeeNames";

export type EmployeeSalaryKey = `${EmployeeName}Salary`;

export const employeeSalarySchema = z
  .number()
  .nonnegative("errors.factory.salaryPositive")
  .int("errors.factory.salaryInteger")
  .max(EMPLOYEE_MAX_SALARY, "errors.factory.salaryTooHigh")
  .optional();

export const employeeSchema = z.object({
  salary: employeeSalarySchema,
  amount: z.number().int().positive().optional(),
});

export type EmployeeSchemaShape = Partial<
  Record<EmployeeName, typeof employeeSchema>
>;
