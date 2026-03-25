import { Difficulty } from "./game/types";

export const DIFFICULTY_OPTIONS = [
  "easy",
  "normal",
  "hard",
] as const satisfies readonly Difficulty[];

export const IMPORT_PRICE_BASE_MULT = 0.75;

export const PUBLIC_PRICE_MULT = {
  easy: 0.7,
  normal: 0.7,
  hard: 1.3,
} satisfies Record<Difficulty, number>;

export const EXPORT_PRICE_MULT = {
  easy: 0.8,
  normal: 0.65,
  hard: 0.5,
} satisfies Record<Difficulty, number>;
