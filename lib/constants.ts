import { Difficulty } from "./game/types";

export const DIFFICULTY_OPTIONS = [
  "easy",
  "normal",
  "hard",
] as const satisfies readonly Difficulty[];
