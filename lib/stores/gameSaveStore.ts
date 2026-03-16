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
  addGameSave: (gameSave: GameSave) => void;
  setActiveGameSave: (gameSaveId: string) => void;
  deleteGameSave: (gameSaveId: string) => void;
};

export const useGameSaveStore = create(
  persist(
    immer<GameSaveState & GameSaveActions>((set) => ({
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      gameSaves: [],
      activeGameSaveId: null,

      addGameSave: (gameSave: GameSave) =>
        set((state) => {
          state.gameSaves.push(gameSave);
          state.activeGameSaveId = gameSave.id;
        }),
      setActiveGameSave: (gameSaveId: string) =>
        set((state) => {
          state.activeGameSaveId = gameSaveId;
        }),
      deleteGameSave: (gameSaveId: string) =>
        set((state) => {
          state.gameSaves = state.gameSaves.filter(
            (gs) => gs.id !== gameSaveId,
          );
          if (state.activeGameSaveId === gameSaveId) {
            state.activeGameSaveId = null;
          }
        }),
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
