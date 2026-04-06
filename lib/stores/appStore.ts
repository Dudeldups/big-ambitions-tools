import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  CalculationPeriod,
  Difficulty,
  PriceSource,
  PriceTarget,
} from "../game/types";
import { omit } from "./omit";
import { BASE_PRODUCT_PRICE_INDEX, DISPLAY_PRICE_OPTIONS } from "../constants";

export type DisplayPrices = {
  source: PriceSource;
  target: PriceTarget;
};

export type AppState = {
  _hasHydrated: boolean;
  difficulty: Difficulty;
  displayPrices: DisplayPrices;
  calculationPeriod: CalculationPeriod;
  tablePriceIndex: number;
};

export type AppActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setDisplayPrices: (source: PriceSource, target: PriceTarget) => void;
  setCalculationPeriod: (period: CalculationPeriod) => void;
  setTablePriceIndex: (index: number) => void;
};

export const initialState: AppState = {
  _hasHydrated: false,
  difficulty: "easy",
  displayPrices: {
    source: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
    target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
  },
  calculationPeriod: "weekly",
  tablePriceIndex: BASE_PRODUCT_PRICE_INDEX,
};

export const useAppStore = create(
  persist(
    immer<AppState & AppActions>((set) => ({
      ...initialState,

      _setHasHydrated: (hasHydrated) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

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

      setCalculationPeriod: (period) =>
        set((state) => {
          state.calculationPeriod = period;
        }),

      setTablePriceIndex: (index) =>
        set((state) => {
          state.tablePriceIndex = index;
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
