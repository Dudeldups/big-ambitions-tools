import { Importer } from "./importerNames";
import { IngredientName } from "./ingredientNames";
import { Price } from "./types";

export type Ingredient = {
  purchasePrice: Price;
  boxAmount: number;
  importers: Importer[];
};

export const ingredients: Record<IngredientName, Ingredient> = {
  Battery: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 15.6,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Capacitors: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Copper Clad Laminate": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Cheap)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Expensive)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 11.7,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Glass: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  "Integrated Circuits": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 9.75,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Metal Band": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Microphone: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Plastic: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  Resistors: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 3.9,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Speaker: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  Transistors: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Cheap)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 39,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Expensive)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 438.75,
    },
    boxAmount: 300,
    importers: ["Maritime Freight Line"],
  },
  "Cigar Paper": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.98,
    },
    boxAmount: 3000,
    importers: ["Global Harvest Traders"],
  },
  "Cigarette Paper": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 3000,
    importers: ["Global Harvest Traders"],
  },
  Clay: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    boxAmount: 300,
    importers: ["Global Harvest Traders"],
  },
  "Metal Wire": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 3.41,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Paper Ream": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 6.09,
    },
    boxAmount: 300,
    importers: ["Global Harvest Traders"],
  },
  "Popcorn Kernels": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Apple)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Banana)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Carrot)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Cheap)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 1.46,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Expensive)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 2.93,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Lettuce)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Pear)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Tomato)": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Global Harvest Traders"],
  },
  Tobacco: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 300,
    importers: ["Global Harvest Traders"],
  },
  Water: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    boxAmount: 150,
    importers: ["Global Harvest Traders", "Aquatic Bay Cargo"],
  },
  Barley: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.23,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Blue Agave": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Caffeine Extract": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    boxAmount: 0,
    importers: ["Aquatic Bay Cargo"],
  },
  "Carbon Dioxide": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    boxAmount: 1500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Cola Flavoring": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    boxAmount: 1500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Flavor Syrup": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.04,
    },
    boxAmount: 0,
    importers: ["Aquatic Bay Cargo"],
  },
  Grapes: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Ground Coffee Beans": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Hair Care Formula": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    boxAmount: 40,
    importers: ["Aquatic Bay Cargo"],
  },
  Hops: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Juniper Berries": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.15,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Lime Juice": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  Sugar: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    boxAmount: 3000,
    importers: ["Aquatic Bay Cargo", "Lunar Tide Shipments"],
  },
  "Tea Leaves": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    boxAmount: 0,
    importers: ["Aquatic Bay Cargo"],
  },
  Vermouth: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  Yeast: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    boxAmount: 150,
    importers: ["Aquatic Bay Cargo"],
  },
  "Bag of Lettuce": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.37,
    },
    boxAmount: 150,
    importers: ["Lunar Tide Shipments"],
  },
  "Bag of Tomatoes": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.35,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  "Baking Mix": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Butter: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    boxAmount: 0,
    importers: ["Lunar Tide Shipments"],
  },
  Cheese: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.31,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  "Chicken Breast": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Dough: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  "Ground Beef": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Milk: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Onion: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.14,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Pepper: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  "Raw Sausage": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.33,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  "Russet Potatoes": {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.39,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
  Vinaigrette: {
    purchasePrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    boxAmount: 300,
    importers: ["Lunar Tide Shipments"],
  },
};
