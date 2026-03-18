import { z } from "zod";
import { DIFFICULTY_OPTIONS } from "../constants";

export const playthroughSchema = z.object({
  characterName: z
    .string()
    .trim()
    .min(1, "Character name is required")
    .max(50, "Character name must be at most 50 characters"),
  difficulty: z.enum(DIFFICULTY_OPTIONS, {
    message: "Please select a difficulty",
  }),
});

export type PlaythroughFormValues = z.infer<typeof playthroughSchema>;
