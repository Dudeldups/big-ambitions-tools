import { InventoryItemName, ShelfName } from "@/lib/game/inventoryNames";
import { InventoryItem, Shelf } from "@/lib/game/types";

export const shelves: Record<ShelfName, Shelf> = {
  palletShelf: {
    purchasePrice: 2500,
    storageCapacity: 60,
  },
  storageShelf: {
    purchasePrice: 1200,
    storageCapacity: 16,
  },
};

export const inventoryItems: Record<InventoryItemName, InventoryItem> = {
  cheapCoffeeMachine: {
    purchasePrice: 400,
  },
  standardFridge: {
    purchasePrice: 1800,
  },
  waterCooler: {
    purchasePrice: 130,
  },
};
