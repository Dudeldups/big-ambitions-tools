import z from "zod";
import { WORKSTATION_NAMES } from "../game/machineNames";
import { PRODUCT_NAMES } from "../game/productNames";

export const factorySchema = z.object({
  name: z.string().max(50, "errors.factory.nameTooLong"),
  description: z
    .string()
    .max(150, "errors.factory.descriptionTooLong")
    .optional(),
  workstations: z
    .array(
      z.object({
        name: z.enum(WORKSTATION_NAMES),
        product: z.enum(PRODUCT_NAMES),
      }),
    )
    .min(1, "errors.factory.workstationsRequired"),
});

export type FactoryFormValues = z.infer<typeof factorySchema>;
