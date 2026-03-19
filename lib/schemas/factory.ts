import z from "zod";

export const factorySchema = z.object({
  name: z.string().max(50, "errors.factory.nameTooLong"),
  description: z
    .string()
    .max(150, "errors.factory.descriptionTooLong")
    .optional(),
});

export type FactoryFormValues = z.infer<typeof factorySchema>;
