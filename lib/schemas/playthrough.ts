import { z } from "zod";
import { DIFFICULTY_OPTIONS } from "../constants";

export const playthroughSchema = z.object({
  characterName: z
    .string()
    .trim()
    .min(1, "errors.playthrough.nameRequired")
    .max(30, "errors.playthrough.nameTooLong"),
  difficulty: z.enum(DIFFICULTY_OPTIONS, {
    message: "errors.playthrough.difficultyRequired",
  }),
});

export type PlaythroughFormValues = z.infer<typeof playthroughSchema>;
