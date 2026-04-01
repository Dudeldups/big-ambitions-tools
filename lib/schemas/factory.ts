import z from "zod";
import { WORKSTATION_NAMES } from "../game/machineNames";
import { PRODUCT_NAMES } from "../game/productNames";
import { VEHICLE_NAMES } from "../game/vehicleNames";
import { employeeSchema, EmployeeSchemaShape } from "./employee";
import { MAX_WORKSTATION_AMOUNT } from "../constants";

export const factorySchema = z.object({
  name: z.string().max(50, "errors.factory.nameTooLong"),
  description: z
    .string()
    .max(150, "errors.factory.descriptionTooLong")
    .optional(),

  openingHours: z.number().min(1).max(24),

  includeInventory: z.boolean(),

  employees: z.object({
    deliveryDriver: employeeSchema,
    logisticsManager: employeeSchema,
    factoryWorker: employeeSchema,
    purchasingAgent: employeeSchema,
    hrManager: employeeSchema,
  } satisfies EmployeeSchemaShape),

  vehicle1: z.enum(VEHICLE_NAMES),
  vehicle2: z.enum(VEHICLE_NAMES).optional(),

  workstations: z
    .array(
      z.object({
        amount: z.number().min(1).max(MAX_WORKSTATION_AMOUNT),
        name: z.enum(WORKSTATION_NAMES),
        product: z.enum(PRODUCT_NAMES),
      }),
    )
    .min(1, "errors.factory.workstationsRequired"),
});

export type FactoryFormValues = z.infer<typeof factorySchema>;

export type EmployeeSalaryFieldName = keyof FactoryFormValues["employees"];
