import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { omit } from "./omit";
import { indexedDBStorage } from "./indexedDBStorage";
import { PlaythroughFormValues } from "../schemas/playthrough";

export type Playthrough = PlaythroughFormValues & {
  id: string;
  createdAt: number;
};

export type PlaythroughState = {
  _hasHydrated: boolean;
  playthroughs: Playthrough[];
  activePlaythroughId: string | null;
};

export type PlaythroughActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  addPlaythrough: (playthrough: PlaythroughFormValues) => Playthrough;
  setActivePlaythrough: (playthroughId: string) => void;
  editPlaythrough: (
    playthroughId: string,
    updatedFields: Partial<PlaythroughFormValues>,
  ) => Playthrough | undefined;
  deletePlaythrough: (playthroughId: string) => Playthrough | undefined;
};

export const usePlaythroughStore = create(
  persist(
    immer<PlaythroughState & PlaythroughActions>((set, get) => ({
      _hasHydrated: false,
      _setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      playthroughs: [],
      activePlaythroughId: null,

      addPlaythrough: (values) => {
        const newPlaythrough: Playthrough = {
          ...values,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((state) => {
          state.playthroughs.push(newPlaythrough);
          state.activePlaythroughId = newPlaythrough.id;
        });

        return newPlaythrough;
      },
      setActivePlaythrough: (playthroughId: string) =>
        set((state) => {
          state.activePlaythroughId = playthroughId;
        }),
      editPlaythrough: (playthroughId, updatedFields) => {
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (playthrough) {
            Object.assign(playthrough, updatedFields);
          }
        });

        return get().playthroughs.find((p) => p.id === playthroughId);
      },
      deletePlaythrough: (playthroughId: string) => {
        const playthroughToDelete = get().playthroughs.find(
          (p) => p.id === playthroughId,
        );

        set((state) => {
          state.playthroughs = state.playthroughs.filter(
            (p) => p.id !== playthroughId,
          );

          if (state.activePlaythroughId === playthroughId) {
            state.activePlaythroughId = null;
          }
        });

        return playthroughToDelete;
      },
    })),
    {
      name: "playthrough-storage",
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
