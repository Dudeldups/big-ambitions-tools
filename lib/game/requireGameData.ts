import { EmployeeName } from "./employeeNames";
import { IngredientName } from "./ingredientNames";
import { InventoryItemName, ShelfName } from "./inventoryNames";
import { MachineName, WorkstationName } from "./machineNames";
import { ProductName } from "./productNames";
import {
  Employee,
  GameData,
  Ingredient,
  InventoryItem,
  Machine,
  Product,
  Shelf,
  Vehicle,
  Workstation,
} from "./types";
import { VehicleName } from "./vehicleNames";

function requireEntry<K extends string, V>(
  entries: Partial<Record<K, V>>,
  key: K,
  entity: string,
): V {
  const value = entries[key];

  if (!value) {
    throw new Error(`${entity} "${key}" is not available in this game data.`);
  }

  return value;
}

export const requireProduct = (
  gameData: GameData,
  productName: ProductName,
): Product => requireEntry(gameData.products, productName, "Product");

export const requireIngredient = (
  gameData: GameData,
  ingredientName: IngredientName,
): Ingredient =>
  requireEntry(gameData.ingredients, ingredientName, "Ingredient");

export const requireMachine = (
  gameData: GameData,
  machineName: MachineName,
): Machine => requireEntry(gameData.machines, machineName, "Machine");

export const requireWorkstation = (
  gameData: GameData,
  workstationName: WorkstationName,
): Workstation =>
  requireEntry(gameData.workstations, workstationName, "Workstation");

export const requireVehicle = (
  gameData: GameData,
  vehicleName: VehicleName,
): Vehicle => requireEntry(gameData.vehicles, vehicleName, "Vehicle");

export const requireEmployee = (
  gameData: GameData,
  employeeName: EmployeeName,
): Employee => requireEntry(gameData.employees, employeeName, "Employee");

export const requireShelf = (gameData: GameData, shelfName: ShelfName): Shelf =>
  requireEntry(gameData.shelves, shelfName, "Shelf");

export const requireInventoryItem = (
  gameData: GameData,
  inventoryItemName: InventoryItemName,
): InventoryItem =>
  requireEntry(gameData.inventoryItems, inventoryItemName, "Inventory item");
