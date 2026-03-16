import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { GameSaveFormValues } from "../schemas/gameSave";
import { omit } from "./omit";
import { indexedDBStorage } from "./indexedDBStorage";

export type GameSave = GameSaveFormValues & {
  id: string;
  createdAt: number;
};

export type GameSaveState = {
  _hasHydrated: boolean;
  gameSaves: GameSave[];
  activeGameSaveId: string | null;
};

export type GameSaveActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  addGameSave: (gameSave: GameSaveFormValues) => GameSave;
  setActiveGameSave: (gameSaveId: string) => void;
  deleteGameSave: (gameSaveId: string) => GameSave;
};

export const useGameSaveStore = create(
  persist(
    immer<GameSaveState & GameSaveActions>((set, get) => ({
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      gameSaves: [],
      activeGameSaveId: null,

      addGameSave: (values) => {
        const newGameSave: GameSave = {
          ...values,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((state) => {
          state.gameSaves.push(newGameSave);
          state.activeGameSaveId = newGameSave.id;
        });
        return newGameSave;
      },
      setActiveGameSave: (gameSaveId: string) =>
        set((state) => {
          state.activeGameSaveId = gameSaveId;
        }),
      deleteGameSave: (gameSaveId: string) => {
        const gameSaveToDelete = get().gameSaves.find(
          (gs) => gs.id === gameSaveId,
        );

        set((state) => {
          state.gameSaves = state.gameSaves.filter(
            (gs) => gs.id !== gameSaveId,
          );

          if (state.activeGameSaveId === gameSaveId) {
            state.activeGameSaveId = null;
          }
        });

        return gameSaveToDelete!;
      },
    })),
    {
      name: "gameSave-storage",
      version: 0,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => omit(state, ["_hasHydrated"]),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
