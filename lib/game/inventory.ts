export type ShelfName = "Pallet Shelf" | "Storage Shelf";

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
