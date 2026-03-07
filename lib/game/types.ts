export type Difficulty = "easy" | "normal" | "hard";

export type Price = {
  [K in Difficulty]: number;
};
