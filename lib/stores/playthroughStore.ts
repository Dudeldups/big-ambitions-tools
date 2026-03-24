import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { omit } from "./omit";
import { indexedDBStorage } from "./indexedDBStorage";
import { PlaythroughFormValues } from "../schemas/playthrough";
import { WorkstationName } from "../game/machineNames";
import { ProductName } from "../game/productNames";
import { FactoryFormValues } from "../schemas/factory";
import { generateUniqueId } from "./generateUniqueId";

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
  activePlaythrough: Playthrough | null;
  factories: Factory[];
};

export type PlaythroughActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  createPlaythrough: (playthrough: PlaythroughFormValues) => Playthrough;
  setActivePlaythrough: (playthroughId: string | null) => void;
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
  createFactory: (factory: FactoryFormValues) => Factory;
  editFactory: (
    factoryId: string,
    updatedFields: Partial<FactoryFormValues>,
  ) => Factory | undefined;
  deleteFactory: (factoryId: string) => Factory | undefined;
  getPlaythroughById: (playthroughId: string) => Playthrough | undefined;
  getFactoryById: (factoryId: string) => Factory | undefined;
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
      activePlaythrough: null,
      factories: [],

      createPlaythrough: (values) => {
        const { playthroughs } = get();

        const existingIds = new Set(playthroughs.map((p) => p.id));
        const id = generateUniqueId(existingIds);

        const newPlaythrough = {
          ...values,
          id,
          createdAt: Date.now(),
          factoryIds: [],
        };

        set((state) => {
          state.playthroughs.unshift(newPlaythrough);
          state.activePlaythrough = newPlaythrough;
        });

        return newPlaythrough;
      },
      setActivePlaythrough: (playthroughId) =>
        set((state) => {
          const playthroughIndex = state.playthroughs.findIndex(
            (p) => p.id === playthroughId,
          );
          if (playthroughIndex > -1) {
            const [playthrough] = state.playthroughs.splice(
              playthroughIndex,
              1,
            );
            state.playthroughs.unshift(playthrough);
            state.activePlaythrough = playthrough;
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

          if (state.activePlaythrough?.id === playthroughId) {
            state.activePlaythrough = null;
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

      createFactory: (values) => {
        const { factories } = get();

        const existingIds = new Set(factories.map((f) => f.id));
        const id = generateUniqueId(existingIds);

        const newFactory: Factory = {
          ...values,
          id,
          createdAt: Date.now(),
        };

        set((state) => {
          state.factories.push(newFactory);
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

      getPlaythroughById: (id) => get().playthroughs.find((p) => p.id === id),

      getFactoryById: (id) => get().factories.find((f) => f.id === id),
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
