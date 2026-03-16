import { z } from "zod";
import { DIFFICULTIES } from "../constants";

export const playthroughSchema = z.object({
  characterName: z.string().min(1, "Character name is required").max(50),
  difficulty: z.enum(DIFFICULTIES, {
    message: "Please select a difficulty",
  }),
});

export type PlaythroughFormValues = z.infer<typeof playthroughSchema>;
