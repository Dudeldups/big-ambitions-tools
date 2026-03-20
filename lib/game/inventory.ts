export const SHELF_NAMES = ["Pallet Shelf", "Storage Shelf"] as const;

export type ShelfName = (typeof SHELF_NAMES)[number];

export type Shelf = {
  purchasePrice: number;
  storageCapacity: number;
};

export const shelves: Record<ShelfName, Shelf> = {
  "Pallet Shelf": {
    purchasePrice: 2500,
    storageCapacity: 60,
  },
  "Storage Shelf": {
    purchasePrice: 1200,
    storageCapacity: 16,
  },
};
