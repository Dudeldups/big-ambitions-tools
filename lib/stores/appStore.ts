import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Difficulty } from "../game/types";
import { omit } from "./omit";

export type AppState = {
  _hasHydrated: boolean;
  difficulty: Difficulty;
};

export type AppActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
};

export const useAppStore = create(
  persist(
    immer<AppState & AppActions>((set) => ({
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      difficulty: "easy",

      setDifficulty: (difficulty: Difficulty) =>
        set((state) => {
          state.difficulty = difficulty;
        }),
    })),
    {
      name: "app-storage",
      version: 0,
      partialize: (state) => omit(state, ["_hasHydrated"]),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
