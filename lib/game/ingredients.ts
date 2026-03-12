import { Importer } from "./importerNames";
import { IngredientName } from "./ingredientNames";
import { Price } from "./types";

export type Ingredient = {
  amountPerBox: number;
  importPrice: Price;
  importers: Importer[];
};

export const ingredients: Record<IngredientName, Ingredient> = {
  Battery: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 15.6,
    },
    importers: ["Maritime Freight Line"],
  },
  Capacitors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["Maritime Freight Line"],
  },
  "Copper Clad Laminate": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Cheap)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Expensive)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 11.7,
    },
    importers: ["Maritime Freight Line"],
  },
  Glass: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  "Integrated Circuits": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 9.75,
    },
    importers: ["Maritime Freight Line"],
  },
  "Metal Band": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    importers: ["Maritime Freight Line"],
  },
  Microphone: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["Maritime Freight Line"],
  },
  Plastic: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  Resistors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.9,
    },
    importers: ["Maritime Freight Line"],
  },
  Speaker: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["Maritime Freight Line"],
  },
  Transistors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Cheap)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 39,
    },
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Expensive)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 438.75,
    },
    importers: ["Maritime Freight Line"],
  },
  "Cigar Paper": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.98,
    },
    importers: ["Global Harvest Traders"],
  },
  "Cigarette Paper": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  Clay: {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    importers: ["Global Harvest Traders"],
  },
  "Metal Wire": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.41,
    },
    importers: ["Global Harvest Traders"],
  },
  "Paper Ream": {
    amountPerBox: 300,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 6.09,
    },
    importers: ["Global Harvest Traders"],
  },
  "Popcorn Kernels": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Apple)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Banana)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Carrot)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Cheap)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 1.46,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Expensive)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.93,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Lettuce)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Pear)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Tomato)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  Tobacco: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Global Harvest Traders"],
  },
  Water: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["Global Harvest Traders", "Aquatic Bay Cargo"],
  },
  Barley: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.23,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Blue Agave": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Caffeine Extract": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Carbon Dioxide": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Cola Flavoring": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Flavor Syrup": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.04,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  Grapes: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Ground Coffee Beans": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Hair Care Formula": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  Hops: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Juniper Berries": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.15,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Lime Juice": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  Sugar: {
    amountPerBox: 1500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    importers: ["Aquatic Bay Cargo", "Lunar Tide Shipments"],
  },
  "Tea Leaves": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  Vermouth: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  Yeast: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["Aquatic Bay Cargo"],
  },
  "Bag of Lettuce": {
    amountPerBox: 250,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.37,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Bag of Tomatoes": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.35,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Baking Mix": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Butter: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Cheese: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.31,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Chicken Breast": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Dough: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Ground Beef": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Milk: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Onion: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.14,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Pepper: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Raw Sausage": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.33,
    },
    importers: ["Lunar Tide Shipments"],
  },
  "Russet Potatoes": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.39,
    },
    importers: ["Lunar Tide Shipments"],
  },
  Vinaigrette: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["Lunar Tide Shipments"],
  },
};
