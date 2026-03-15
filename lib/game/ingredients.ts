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
    importers: ["maritimefreight"],
  },
  Capacitors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["maritimefreight"],
  },
  "Copper Clad Laminate": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["maritimefreight"],
  },
  "Fabric (Cheap)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["maritimefreight"],
  },
  "Fabric (Expensive)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 11.7,
    },
    importers: ["maritimefreight"],
  },
  Glass: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["maritimefreight", "globalharvest"],
  },
  "Integrated Circuits": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 9.75,
    },
    importers: ["maritimefreight"],
  },
  "Metal Band": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    importers: ["maritimefreight"],
  },
  Microphone: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["maritimefreight"],
  },
  Plastic: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.59,
    },
    importers: ["maritimefreight", "globalharvest"],
  },
  Resistors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.9,
    },
    importers: ["maritimefreight"],
  },
  Speaker: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 5.85,
    },
    importers: ["maritimefreight"],
  },
  Transistors: {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 7.8,
    },
    importers: ["maritimefreight"],
  },
  "Uncut Gems (Cheap)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 39,
    },
    importers: ["maritimefreight"],
  },
  "Uncut Gems (Expensive)": {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 438.75,
    },
    importers: ["maritimefreight"],
  },
  "Cigar Paper": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.98,
    },
    importers: ["globalharvest"],
  },
  "Cigarette Paper": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  Clay: {
    amountPerBox: 150,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    importers: ["globalharvest"],
  },
  "Metal Wire": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 3.41,
    },
    importers: ["globalharvest"],
  },
  "Paper Ream": {
    amountPerBox: 300,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 6.09,
    },
    importers: ["globalharvest"],
  },
  "Popcorn Kernels": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Apple)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Banana)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Carrot)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Flower Cheap)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 1.46,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Flower Expensive)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.93,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Lettuce)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Pear)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  "Seeds (Tomato)": {
    amountPerBox: 1000,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  Tobacco: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["globalharvest"],
  },
  Water: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["globalharvest", "aquaticbay"],
  },
  Barley: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.23,
    },
    importers: ["aquaticbay"],
  },
  "Blue Agave": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["aquaticbay"],
  },
  "Caffeine Extract": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["aquaticbay"],
  },
  "Carbon Dioxide": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["aquaticbay"],
  },
  "Cola Flavoring": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["aquaticbay"],
  },
  "Flavor Syrup": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.04,
    },
    importers: ["aquaticbay"],
  },
  Grapes: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    importers: ["aquaticbay"],
  },
  "Ground Coffee Beans": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["aquaticbay"],
  },
  "Hair Care Formula": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 2.44,
    },
    importers: ["aquaticbay"],
  },
  Hops: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["aquaticbay"],
  },
  "Juniper Berries": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.15,
    },
    importers: ["aquaticbay"],
  },
  "Lime Juice": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.02,
    },
    importers: ["aquaticbay"],
  },
  Sugar: {
    amountPerBox: 1500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    importers: ["aquaticbay", "lunartide"],
  },
  "Tea Leaves": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.12,
    },
    importers: ["aquaticbay"],
  },
  Vermouth: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["aquaticbay"],
  },
  Yeast: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.01,
    },
    importers: ["aquaticbay"],
  },
  "Bag of Lettuce": {
    amountPerBox: 250,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.37,
    },
    importers: ["lunartide"],
  },
  "Bag of Tomatoes": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.35,
    },
    importers: ["lunartide"],
  },
  "Baking Mix": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["lunartide"],
  },
  Butter: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.49,
    },
    importers: ["lunartide"],
  },
  Cheese: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.31,
    },
    importers: ["lunartide"],
  },
  "Chicken Breast": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.34,
    },
    importers: ["lunartide"],
  },
  Dough: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    importers: ["lunartide"],
  },
  "Ground Beef": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.54,
    },
    importers: ["lunartide"],
  },
  Milk: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.05,
    },
    importers: ["lunartide"],
  },
  Onion: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.14,
    },
    importers: ["lunartide"],
  },
  Pepper: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["lunartide"],
  },
  "Raw Sausage": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.33,
    },
    importers: ["lunartide"],
  },
  "Russet Potatoes": {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.39,
    },
    importers: ["lunartide"],
  },
  Vinaigrette: {
    amountPerBox: 500,
    importPrice: {
      easy: 0,
      normal: 0,
      hard: 0.1,
    },
    importers: ["lunartide"],
  },
};
