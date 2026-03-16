import { z } from "zod";
import { DIFFICULTIES } from "../constants";

export const gameSaveSchema = z.object({
  characterName: z.string().min(1, "Character name is required").max(50),
  difficulty: z.enum(DIFFICULTIES, {
    message: "Please select a difficulty",
  }),
});

export type GameSaveFormValues = z.infer<typeof gameSaveSchema>;
