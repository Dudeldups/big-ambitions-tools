import { Importer } from "./importerNames";
import { IngredientName } from "./ingredientNames";
import { Price } from "./types";

export type Ingredient = {
  importPrice: Price;
  amountPerBox: number;
  importers: Importer[];
};

export const ingredients: Record<IngredientName, Ingredient> = {
  Battery: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 15.6,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line"],
  },
  Capacitors: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    amountPerBox: 1000,
    importers: ["Maritime Freight Line"],
  },
  "Copper Clad Laminate": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Cheap)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    amountPerBox: 150,
    importers: ["Maritime Freight Line"],
  },
  "Fabric (Expensive)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 11.7,
    },
    amountPerBox: 150,
    importers: ["Maritime Freight Line"],
  },
  Glass: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  "Integrated Circuits": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 9.75,
    },
    amountPerBox: 1000,
    importers: ["Maritime Freight Line"],
  },
  "Metal Band": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    amountPerBox: 150,
    importers: ["Maritime Freight Line"],
  },
  Microphone: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line"],
  },
  Plastic: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line", "Global Harvest Traders"],
  },
  Resistors: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.9,
    },
    amountPerBox: 1000,
    importers: ["Maritime Freight Line"],
  },
  Speaker: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    amountPerBox: 500,
    importers: ["Maritime Freight Line"],
  },
  Transistors: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    amountPerBox: 1000,
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Cheap)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 39,
    },
    amountPerBox: 150,
    importers: ["Maritime Freight Line"],
  },
  "Uncut Gems (Expensive)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 438.75,
    },
    amountPerBox: 150,
    importers: ["Maritime Freight Line"],
  },
  "Cigar Paper": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.98,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Cigarette Paper": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  Clay: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    amountPerBox: 150,
    importers: ["Global Harvest Traders"],
  },
  "Metal Wire": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.41,
    },
    amountPerBox: 500,
    importers: ["Global Harvest Traders"],
  },
  "Paper Ream": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 6.09,
    },
    amountPerBox: 300,
    importers: ["Global Harvest Traders"],
  },
  "Popcorn Kernels": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    amountPerBox: 500,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Apple)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Banana)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Carrot)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Cheap)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 1.46,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Flower Expensive)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.93,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Lettuce)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Pear)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  "Seeds (Tomato)": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 1000,
    importers: ["Global Harvest Traders"],
  },
  Tobacco: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 500,
    importers: ["Global Harvest Traders"],
  },
  Water: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    amountPerBox: 500,
    importers: ["Global Harvest Traders", "Aquatic Bay Cargo"],
  },
  Barley: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.23,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Blue Agave": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Caffeine Extract": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Carbon Dioxide": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Cola Flavoring": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Flavor Syrup": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.04,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  Grapes: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Ground Coffee Beans": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Hair Care Formula": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  Hops: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Juniper Berries": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.15,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Lime Juice": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  Sugar: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    amountPerBox: 1500,
    importers: ["Aquatic Bay Cargo", "Lunar Tide Shipments"],
  },
  "Tea Leaves": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  Vermouth: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  Yeast: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    amountPerBox: 500,
    importers: ["Aquatic Bay Cargo"],
  },
  "Bag of Lettuce": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.37,
    },
    amountPerBox: 250,
    importers: ["Lunar Tide Shipments"],
  },
  "Bag of Tomatoes": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.35,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  "Baking Mix": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Butter: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Cheese: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.31,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  "Chicken Breast": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Dough: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  "Ground Beef": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Milk: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Onion: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.14,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Pepper: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  "Raw Sausage": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.33,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  "Russet Potatoes": {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.39,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
  Vinaigrette: {
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    amountPerBox: 500,
    importers: ["Lunar Tide Shipments"],
  },
};
