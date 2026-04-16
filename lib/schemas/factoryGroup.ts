import { z } from "zod";

export const factoryGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "errors.factoryGroup.nameRequired")
    .max(30, "errors.factoryGroup.nameTooLong"),
  color: z.string().optional(),
});

export type FactoryGroupFormValues = z.infer<typeof factoryGroupSchema>;
