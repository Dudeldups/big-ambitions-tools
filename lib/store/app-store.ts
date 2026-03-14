import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Difficulty } from "../game/types";

type AppState = {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
};

export const useAppStore = create(
  persist(
    immer<AppState>((set) => ({
      difficulty: "easy",

      setDifficulty: (difficulty: Difficulty) =>
        set((state) => {
          state.difficulty = difficulty;
        }),
    })),
    {
      name: "app-storage",
      version: 0,
      skipHydration: true,
    },
  ),
);
