import { CALCULATION_PERIODS, DIFFICULTY_OPTIONS } from "./../constants";
import { IngredientName } from "./ingredientNames";
import { MachineName, WorkstationName } from "./machineNames";
import { ProductName } from "./productNames";
import { DISPLAY_PRICE_OPTIONS } from "../constants";
import { EmployeeName } from "./employeeNames";
import { VehicleName } from "./vehicleNames";
import { InventoryItemName, ShelfName } from "./inventoryNames";
import { Importer } from "./importerNames";

export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];

export type CalculationPeriod = (typeof CALCULATION_PERIODS)[number];

export type StoreDifficulty = Difficulty | null | undefined;

export type Price = {
  [K in Difficulty]: number;
};

export type PriceSource =
  (typeof DISPLAY_PRICE_OPTIONS)["SOURCE"][keyof (typeof DISPLAY_PRICE_OPTIONS)["SOURCE"]];
export type PriceTarget =
  (typeof DISPLAY_PRICE_OPTIONS)["TARGET"][keyof (typeof DISPLAY_PRICE_OPTIONS)["TARGET"]];

type TableKeyMap = {
  products: ProductName;
  ingredients: IngredientName;
  machines: MachineName;
  workstations: WorkstationName;
};

export type TableType = keyof TableKeyMap;

export type TableData<T extends TableType, V> = [TableKeyMap[T], V][];

export type Product = {
  amountPerBox: number;
  wholesalePrice: number;
  defaultMarketPrice: number;
  productSalesRatio: number;
  importers: Importer[];
  ingredients: {
    [key in IngredientName]?: number;
  }[];
  productionRate: number;
  workstation: WorkstationName;
};

export type Ingredient = {
  amountPerBox: number;
  wholesalePrice: number;
  defaultMarketPrice: number;
  productSalesRatio: number;
  importers: Importer[];
};

export type Machine = {
  purchasePrice: number;
};

export type Workstation = {
  neededMachines: MachineName[];
};

export type Vehicle = {
  id: number;
  purchasePrice: number;
  isATruck: boolean;
  maxFuel: number;
  maxCargoCapacity: number;
  maxSpeed: number;
  enginePower: number;
  brakeForce: number;
  autoParkSupported: boolean;
  taxDeductible: boolean;
  hasRadio: boolean;
  requiredDeliveryDriverSkillValue: number;
  destinationsThatCanDeliver: number;
};

export type Employee = {
  baseHourlyWage: number;
  hasParttimeDemand: boolean;
  customWorkingHours?: number;
};

export type Shelf = {
  purchasePrice: number;
  storageCapacity: number;
};

export type InventoryItem = {
  purchasePrice: number;
};

export type GameData = {
  products: Partial<Record<ProductName, Product>>;
  ingredients: Partial<Record<IngredientName, Ingredient>>;
  machines: Partial<Record<MachineName, Machine>>;
  workstations: Partial<Record<WorkstationName, Workstation>>;
  employees: Partial<Record<EmployeeName, Employee>>;
  vehicles: Partial<Record<VehicleName, Vehicle>>;
  shelves: Partial<Record<ShelfName, Shelf>>;
  inventoryItems: Partial<Record<InventoryItemName, InventoryItem>>;
};
