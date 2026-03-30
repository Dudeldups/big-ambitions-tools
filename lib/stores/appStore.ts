import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Difficulty, PriceSource, PriceTarget } from "../game/types";
import { omit } from "./omit";
import { DISPLAY_PRICE_OPTIONS } from "../constants";

export type DisplayPrices = {
  source: PriceSource;
  target: PriceTarget;
};

export type AppState = {
  _hasHydrated: boolean;
  difficulty: Difficulty;
  displayPrices: DisplayPrices;
};

export type AppActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setDisplayPrices: (source: PriceSource, target: PriceTarget) => void;
};

export const useAppStore = create(
  persist(
    immer<AppState & AppActions>((set) => ({
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      difficulty: "easy",
      displayPrices: {
        source: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
        target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
      },

      setDifficulty: (difficulty) =>
        set((state) => {
          state.difficulty = difficulty;
        }),

      setDisplayPrices: (source, target) =>
        set((state) => {
          state.displayPrices = {
            source,
            target,
          };
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
