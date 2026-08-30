import { GameData } from "@/lib/game/types";
import { employees } from "./employees";
import { ingredients } from "./ingredients";
import { inventoryItems, shelves } from "./inventory";
import { machines, workstations } from "./machines";
import { products } from "./products";
import { vehicles } from "./vehicles";

export const gameData = {
  products,
  ingredients,
  machines,
  workstations,
  employees,
  vehicles,
  shelves,
  inventoryItems,
} satisfies GameData;
