import { Difficulty } from "./game/types";

export const DIFFICULTIES = [
  "easy",
  "normal",
  "hard",
] as const satisfies readonly Difficulty[];
