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

export type Factory = FactoryFormValues & {
  id: string;
  createdAt: number;
};

export type PriceIndices = Partial<Record<ProductName, number>>;

export type Playthrough = PlaythroughFormValues & {
  id: string;
  createdAt: number;
  isActive: boolean;
  factoryIds: string[];
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
  getPlaythroughById: (playthroughId: string) => Playthrough | undefined;
  getFactoryById: (factoryId: string) => Factory | undefined;
  setPriceIndex: (
    playthroughId: string,
    productName: ProductName,
    index: number,
  ) => void;
  getPriceIndices: (playthroughId: string) => PriceIndices;
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
        });

        return factoryToDelete;
      },

      getPlaythroughById: (id) => get().playthroughs.find((p) => p.id === id),
      getFactoryById: (id) => get().factories.find((f) => f.id === id),

      setPriceIndex: (playthroughId, productName, index) => {
        set((state) => {
          const playthrough = state.playthroughs.find(
            (p) => p.id === playthroughId,
          );

          if (!playthrough) return;

          playthrough.priceIndices[productName] = index;
        });
      },
      getPriceIndices: (playthroughId) =>
        get().playthroughs.find((p) => p.id === playthroughId)?.priceIndices ||
        {},

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
