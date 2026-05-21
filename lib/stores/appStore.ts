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
import { DEFAULT_GAME_VERSION, GameVersion } from "../game/versions";

export type DisplayPrices = {
  source: PriceSource;
  target: PriceTarget;
};

export type AppState = {
  _hasHydrated: boolean;
  difficulty: Difficulty;
  gameVersion: GameVersion;
  displayPrices: DisplayPrices;
  calculationPeriod: CalculationPeriod;
  tablePriceIndex: number;
};

type PersistedAppState = Omit<AppState, "_hasHydrated">;

export type AppActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGameVersion: (gameVersion: GameVersion) => void;
  setDisplayPrices: (source: PriceSource, target: PriceTarget) => void;
  setCalculationPeriod: (period: CalculationPeriod) => void;
  setTablePriceIndex: (index: number) => void;
};

export const initialAppState: AppState = {
  _hasHydrated: false,
  difficulty: "easy",
  gameVersion: DEFAULT_GAME_VERSION,
  displayPrices: {
    source: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
    target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
  },
  calculationPeriod: "weekly",
  tablePriceIndex: BASE_PRODUCT_PRICE_INDEX,
};

const initialPersistedAppState: PersistedAppState = omit(initialAppState, [
  "_hasHydrated",
]);

export const useAppStore = create(
  persist(
    immer<AppState & AppActions>((set) => ({
      ...initialAppState,

      _setHasHydrated: (hasHydrated) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      setDifficulty: (difficulty) =>
        set((state) => {
          state.difficulty = difficulty;
        }),

      setGameVersion: (gameVersion) =>
        set((state) => {
          state.gameVersion = gameVersion;
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
      version: 1,
      partialize: (state) => omit(state, ["_hasHydrated"]),
      skipHydration: true,
      migrate: (persistedState) => {
        const state = persistedState as PersistedAppState | undefined;

        if (!state) return initialPersistedAppState;

        return {
          ...state,
          gameVersion: state.gameVersion ?? DEFAULT_GAME_VERSION,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
