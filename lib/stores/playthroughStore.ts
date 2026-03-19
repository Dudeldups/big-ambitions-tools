import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { omit } from "./omit";
import { indexedDBStorage } from "./indexedDBStorage";
import { PlaythroughFormValues } from "../schemas/playthrough";
import { WorkstationName } from "../game/machineNames";
import { ProductName } from "../game/productNames";
import { FactoryFormValues } from "../schemas/factory";

export type FactoryWorkstation = {
  name: WorkstationName;
  product: ProductName;
};

export type Factory = FactoryFormValues & {
  id: string;
  createdAt: number;
  workstations: FactoryWorkstation[];
};

export type Playthrough = PlaythroughFormValues & {
  id: string;
  createdAt: number;
  factoryIds: string[];
};

export type PlaythroughState = {
  _hasHydrated: boolean;
  playthroughs: Playthrough[];
  activePlaythroughId: string | null;
  factories: Factory[];
};

export type PlaythroughActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  createPlaythrough: (playthrough: PlaythroughFormValues) => Playthrough;
  setActivePlaythrough: (playthroughId: string) => void;
  editPlaythrough: (
    playthroughId: string,
    updatedFields: Partial<PlaythroughFormValues>,
  ) => Playthrough | undefined;
  deletePlaythrough: (playthroughId: string) => Playthrough | undefined;
  addFactoryToPlaythrough: (playthroughId: string, factoryId: string) => void;
  removeFactoryFromPlaythrough: (
    playthroughId: string,
    factoryId: string,
  ) => void;
  createFactory: (playthroughId: string, factory: FactoryFormValues) => Factory;
  editFactory: (
    factoryId: string,
    updatedFields: Partial<FactoryFormValues>,
  ) => Factory | undefined;
  deleteFactory: (factoryId: string) => Factory | undefined;
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
      factories: [],

      createPlaythrough: (values) => {
        const newPlaythrough: Playthrough = {
          ...values,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          factoryIds: [],
        };
        set((state) => {
          state.playthroughs.push(newPlaythrough);
          state.activePlaythroughId = newPlaythrough.id;
        });

        return newPlaythrough;
      },
      setActivePlaythrough: (playthroughId) =>
        set((state) => {
          state.activePlaythroughId = playthroughId;
          const playthroughIndex = state.playthroughs.findIndex(
            (p) => p.id === playthroughId,
          );
          if (playthroughIndex > -1) {
            const [playthrough] = state.playthroughs.splice(
              playthroughIndex,
              1,
            );
            state.playthroughs.unshift(playthrough);
          }
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
      deletePlaythrough: (playthroughId) => {
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
      addFactoryToPlaythrough: (playthroughId, factoryId) =>
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (playthrough && !playthrough.factoryIds.includes(factoryId)) {
            playthrough.factoryIds.push(factoryId);
          }
        }),
      removeFactoryFromPlaythrough: (playthroughId, factoryId) =>
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (playthrough) {
            playthrough.factoryIds = playthrough.factoryIds.filter(
              (id) => id !== factoryId,
            );
          }
        }),

      createFactory: (playthroughId, factory) => {
        const newFactory: Factory = {
          ...factory,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          workstations: [],
        };
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (playthrough) {
            state.factories.push(newFactory);
            playthrough.factoryIds.push(newFactory.id);
          }
        });

        return newFactory;
      },
      editFactory: (
        factoryId: string,
        updatedFields: Partial<FactoryFormValues>,
      ) => {
        set((state) => {
          const factory = state.factories.find((f) => f.id === factoryId);
          if (factory) {
            Object.assign(factory, updatedFields);
          }
        });

        return get().factories.find((f) => f.id === factoryId);
      },
      deleteFactory: (factoryId) => {
        const factoryToDelete = get().factories.find((f) => f.id === factoryId);
        set((state) => {
          state.factories = state.factories.filter((f) => f.id !== factoryId);
          state.playthroughs.forEach((p) => {
            p.factoryIds = p.factoryIds.filter((id) => id !== factoryId);
          });
        });

        return factoryToDelete;
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
