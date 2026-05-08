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

  shelfAmount: z.number().min(1, "errors.factory.shelfAmountTooLow"),

  employees: employeesSchema,

  vehicles: z
    .array(z.object({ name: z.enum(VEHICLE_NAMES) }))
    .min(1)
    .max(2),

  workstations: z
    .array(
      z.object({
        amount: z.number().min(1).max(MAX_WORKSTATION_AMOUNT),
        name: z.enum(WORKSTATION_NAMES),
        product: z.enum(PRODUCT_NAMES),
        salesAmount: z.preprocess(
          (value) => (value === null ? undefined : value),
          z.number().optional(),
        ),
        productionLimit: z.number().min(0).optional(),
      }),
    )
    .min(1, "errors.factory.workstationsRequired"),
});

export type FactoryFormValues = z.infer<typeof factorySchema>;

export type FormWorkstations = FactoryFormValues["workstations"];
export type FormVehicles = FactoryFormValues["vehicles"];
export type FormOpeningHours = FactoryFormValues["openingHours"];
