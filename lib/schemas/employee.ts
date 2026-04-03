import z from "zod";
import { EMPLOYEE_MAX_SALARY } from "../constants";
import { EmployeeName } from "../game/employeeNames";

export type EmployeeSalaryKey = `${EmployeeName}Salary`;

const baseSalarySchema = z
  .number()
  .nonnegative("errors.factory.salaryPositive")
  .max(EMPLOYEE_MAX_SALARY, "errors.factory.salaryTooHigh");

const integerSalarySchema = baseSalarySchema.int();

const floatSalarySchema = baseSalarySchema;

export const employeeSchemaInteger = z.object({
  salary: integerSalarySchema,
  amount: z.number().int().nonnegative(),
});

export const employeeSchemaFloat = z.object({
  salary: floatSalarySchema,
  amount: z.number().nonnegative(),
});

export const employeesSchema = z.object({
  deliveryDriver: employeeSchemaInteger,
  logisticsManager: employeeSchemaInteger,
  factoryWorker: employeeSchemaInteger,
  purchasingAgent: employeeSchemaInteger,
  hrManager: employeeSchemaFloat,
});

export type FormEmployees = z.infer<typeof employeesSchema>;
