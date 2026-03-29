import { Difficulty } from "./game/types";

export const NONE_VALUE = "__none__" as const;

export const EMPLOYEE_MAX_SALARY = 1000 as const;

export const SALARY_BASE_MULT = 2.25 as const;

export const SALARY_DIFF_MULT = {
  easy: 0.5,
  normal: 0.7,
  hard: 1,
} as const satisfies Record<Difficulty, number>;

export const DIFFICULTY_OPTIONS = [
  "easy",
  "normal",
  "hard",
] as const satisfies readonly Difficulty[];

export const IMPORT_PRICE_BASE_MULT = 0.75 as const;

export const PUBLIC_PRICE_MULT = {
  easy: 0.7,
  normal: 0.7,
  hard: 1.3,
} as const satisfies Record<Difficulty, number>;

export const EXPORT_PRICE_MULT = {
  easy: 0.8,
  normal: 0.65,
  hard: 0.5,
} as const satisfies Record<Difficulty, number>;
