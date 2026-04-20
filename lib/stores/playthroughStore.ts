import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { omit } from "./omit";
import { indexedDBStorage } from "./indexedDBStorage";
import { PlaythroughFormValues } from "../schemas/playthrough";
import { FactoryFormValues } from "../schemas/factory";
import { generateUniqueId } from "./generateUniqueId";
import { ProductName } from "../game/productNames";
import { products } from "../game/products";
import { BASE_PRODUCT_PRICE_INDEX } from "../constants";
import { FactoryGroupFormValues } from "../schemas/factoryGroup";

export type Factory = FactoryFormValues & {
  id: string;
  createdAt: number;
};

export type PriceIndices = Partial<Record<ProductName, number>>;

export type FactoryGroup = FactoryGroupFormValues & {
  id: string;
  factoryIds: string[];
};

export type Playthrough = PlaythroughFormValues & {
  id: string;
  createdAt: number;
  isActive: boolean;
  factoryIds: string[];
  factoryGroups: FactoryGroup[];
  priceIndices: PriceIndices;
};

export type PlaythroughState = {
  _hasHydrated: boolean;
  playthroughs: Playthrough[];
  factories: Factory[];
  templateFactory: Factory | undefined;
};

export type PlaythroughActions = {
  _setHasHydrated: (hasHydrated: boolean) => void;
  createPlaythrough: (playthrough: PlaythroughFormValues) => Playthrough;
  editPlaythrough: (
    playthroughId: string,
    updatedFields: Partial<PlaythroughFormValues>,
  ) => Playthrough | undefined;
  deletePlaythrough: (playthroughId: string) => Playthrough | undefined;
  setActivePlaythrough: (playthroughId: string | null) => void;
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
  deleteFactory: (
    factoryId: string,
    playthroughId: string,
  ) => Factory | undefined;
  createFactoryGroup: (
    playthroughId: string,
    group: FactoryGroupFormValues,
  ) => FactoryGroup;
  editFactoryGroup: (
    playthroughId: string,
    groupId: string,
    updatedFields: Partial<FactoryGroupFormValues>,
  ) => FactoryGroup | undefined;
  deleteFactoryGroup: (
    playthroughId: string,
    groupId: string,
  ) => FactoryGroup | undefined;
  addFactoryToGroup: (
    playthroughId: string,
    factoryId: string,
    groupId: string,
  ) => FactoryGroup | undefined;
  removeFactoryFromAllGroups: (
    playthroughId: string,
    factoryId: string,
  ) => void;

  getPlaythroughById: (playthroughId: string) => Playthrough | undefined;
  getFactoryById: (factoryId: string) => Factory | undefined;
  getGroupById: (
    playthroughId: string,
    groupId: string,
  ) => FactoryGroup | undefined;
  getPriceIndices: (playthroughId: string) => PriceIndices;

  setPriceIndex: (
    playthroughId: string,
    productName: ProductName,
    index: number,
  ) => void;
  setTemplateFactory: (factory: Factory | undefined) => void;
};

export const initialPlaythroughState: PlaythroughState = {
  _hasHydrated: false,
  playthroughs: [],
  factories: [],
  templateFactory: undefined,
};

export const usePlaythroughStore = create(
  persist(
    immer<PlaythroughState & PlaythroughActions>((set, get) => ({
      ...initialPlaythroughState,

      _setHasHydrated: (hasHydrated: boolean) =>
        set((state) => {
          state._hasHydrated = hasHydrated;
        }),

      createPlaythrough: (values) => {
        const { playthroughs } = get();

        const existingIds = new Set(playthroughs.map((p) => p.id));
        const id = generateUniqueId(existingIds);

        const defaultPriceIndices = Object.fromEntries(
          Object.entries(products)
            .filter(([, p]) => p.defaultMarketPrice > 0)
            .map(([productName]) => [
              productName as ProductName,
              BASE_PRODUCT_PRICE_INDEX,
            ]),
        ) as PriceIndices;

        const newPlaythrough = {
          ...values,
          id,
          isActive: true,
          createdAt: Date.now(),
          factoryIds: [],
          factoryGroups: [],
          priceIndices: defaultPriceIndices,
        };

        set((state) => {
          state.playthroughs.forEach((p) => {
            p.isActive = false;
          });
          state.playthroughs.unshift(newPlaythrough);
        });

        return newPlaythrough;
      },

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
        });

        return playthroughToDelete;
      },

      setActivePlaythrough: (playthroughId) =>
        set((state) => {
          const playthroughIndex = state.playthroughs.findIndex(
            (p) => p.id === playthroughId,
          );
          if (playthroughIndex > -1) {
            state.playthroughs.forEach((p) => (p.isActive = false));
            const [playthrough] = state.playthroughs.splice(
              playthroughIndex,
              1,
            );
            playthrough.isActive = true;
            state.playthroughs.unshift(playthrough);
          }
        }),

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

      deleteFactory: (factoryId, playthroughId) => {
        const factoryToDelete = get().factories.find((f) => f.id === factoryId);
        set((state) => {
          state.playthroughs.forEach((p) => {
            if (p.id === playthroughId && p.factoryIds.includes(factoryId)) {
              p.factoryIds = p.factoryIds.filter((id) => id !== factoryId);
            }
          });

          state.playthroughs.forEach((p) => {
            p.factoryGroups.forEach((g) => {
              if (g.factoryIds.includes(factoryId)) {
                g.factoryIds = g.factoryIds.filter((id) => id !== factoryId);
              }
            });
          });

          state.factories = state.factories.filter((f) => f.id !== factoryId);
        });

        return factoryToDelete;
      },

      createFactoryGroup: (playthroughId, group) => {
        const existingGroups =
          get().playthroughs.find((p) => p.id === playthroughId)
            ?.factoryGroups || [];

        const existingIds = new Set(existingGroups.map((g) => g.id));
        const newId = generateUniqueId(existingIds);

        const newGroup: FactoryGroup = {
          id: newId,
          name: group.name,
          color: group.color,
          factoryIds: [],
        };

        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (!playthrough) return;

          playthrough.factoryGroups.push(newGroup);
        });

        return newGroup;
      },

      editFactoryGroup: (playthroughId, groupId, updatedFields) => {
        let updatedGroup: FactoryGroup | undefined;

        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (!playthrough) return;

          const group = playthrough.factoryGroups.find((g) => g.id === groupId);
          if (!group) return;

          Object.assign(group, updatedFields);
          updatedGroup = { ...group };
        });

        return updatedGroup;
      },

      deleteFactoryGroup: (playthroughId, groupId) => {
        let deletedGroup: FactoryGroup | undefined;

        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (!playthrough) return;

          const index = playthrough.factoryGroups.findIndex(
            (g) => g.id === groupId,
          );
          if (index === -1) return;

          deletedGroup = playthrough.factoryGroups[index];

          playthrough.factoryGroups.splice(index, 1);
        });

        return deletedGroup;
      },

      addFactoryToGroup: (playthroughId, factoryId, groupId) => {
        let updatedGroup: FactoryGroup | undefined;

        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (!playthrough) return;
          if (!playthrough.factoryIds.includes(factoryId)) return;

          const targetGroup = playthrough.factoryGroups.find(
            (g) => g.id === groupId,
          );
          if (!targetGroup) return;

          playthrough.factoryGroups.forEach((g) => {
            if (g.factoryIds.includes(factoryId)) {
              g.factoryIds = g.factoryIds.filter((id) => id !== factoryId);
            }
          });

          targetGroup.factoryIds.push(factoryId);

          updatedGroup = targetGroup;
        });

        return updatedGroup;
      },

      removeFactoryFromAllGroups: (playthroughId, factoryId) => {
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );
          if (!playthrough) return;
          if (!playthrough.factoryIds.includes(factoryId)) return;

          for (const group of playthrough.factoryGroups) {
            const index = group.factoryIds.indexOf(factoryId);
            if (index !== -1) {
              group.factoryIds.splice(index, 1);
              break;
            }
          }
        });
      },

      getPlaythroughById: (id) => get().playthroughs.find((p) => p.id === id),
      getFactoryById: (id) => get().factories.find((f) => f.id === id),
      getGroupById: (pId: string, gId: string) =>
        get()
          .playthroughs.find((p) => p.id === pId)
          ?.factoryGroups.find((g) => g.id === gId),
      getPriceIndices: (playthroughId) =>
        get().playthroughs.find((p) => p.id === playthroughId)?.priceIndices ||
        {},

      setPriceIndex: (playthroughId, productName, index) => {
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );

          if (!playthrough) return;

          playthrough.priceIndices[productName] = index;
        });
      },

      setTemplateFactory: (factory) =>
        set((state) => {
          state.templateFactory = factory;
        }),
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
