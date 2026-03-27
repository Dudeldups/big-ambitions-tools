export const SHELF_NAMES = ["palletShelf", "storageShelf"] as const;

export type ShelfName = (typeof SHELF_NAMES)[number];

export const INVENTORY_ITEM_NAMES = [
  "cheapCoffeeMachine",
  "standardFridge",
  "waterCooler",
] as const;

export type InventoryItemName = (typeof INVENTORY_ITEM_NAMES)[number];
