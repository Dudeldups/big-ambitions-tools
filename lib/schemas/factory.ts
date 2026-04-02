import z from "zod";
import { WORKSTATION_NAMES } from "../game/machineNames";
import { PRODUCT_NAMES } from "../game/productNames";
import { VEHICLE_NAMES } from "../game/vehicleNames";
import { MAX_WORKSTATION_AMOUNT } from "../constants";
import { employeesSchema } from "./employee";

export const factorySchema = z.object({
  name: z.string().max(50, "errors.factory.nameTooLong"),
  description: z
    .string()
    .max(150, "errors.factory.descriptionTooLong")
    .optional(),

  openingHours: z.number().min(1).max(24),

  deliveryPeriod: z.enum(["daily", "weekly"]),

  employees: employeesSchema,

  vehicle1: z.enum(VEHICLE_NAMES),
  vehicle2: z.enum(VEHICLE_NAMES).optional(),

  workstations: z
    .array(
      z.object({
        amount: z.number().min(1).max(MAX_WORKSTATION_AMOUNT),
        name: z.enum(WORKSTATION_NAMES),
        product: z.enum(PRODUCT_NAMES),
        salesAmount: z.number().optional(),
      }),
    )
    .min(1, "errors.factory.workstationsRequired"),
});

export type FactoryFormValues = z.infer<typeof factorySchema>;

export type FormWorkstations = FactoryFormValues["workstations"];
