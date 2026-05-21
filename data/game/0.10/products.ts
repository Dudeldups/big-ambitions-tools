import { ProductName } from "@/lib/game/productNames";
import { Product } from "@/lib/game/types";

export const products = {
  hotdog: {
    amountPerBox: 500,
    id: 2,
    wholesalePrice: 4.45,
    defaultMarketPrice: 11.65,
    productSalesRatio: 0.66,
    importers: ["jetcargo"],
    ingredients: [
      {
        rawSausage: 200,
      },
      {
        dough: 200,
      },
      {
        tomato: 50,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  sodaCan: {
    amountPerBox: 500,
    id: 3,
    wholesalePrice: 0.5,
    defaultMarketPrice: 3,
    productSalesRatio: 0.66,
    importers: ["jetcargo", "seaside", "unitedocean", "bluestone"],
    ingredients: [
      {
        water: 250,
      },
      {
        sugar: 250,
      },
      {
        carbonDioxide: 250,
      },
      {
        colaFlavoring: 250,
      },
    ],
    productionRate: 250,
    workstation: "bottledGoodsWorkstation",
  },
  pizza: {
    amountPerBox: 500,
    id: 6,
    wholesalePrice: 8,
    defaultMarketPrice: 22,
    productSalesRatio: 0.4,
    importers: ["jetcargo"],
    ingredients: [
      {
        dough: 200,
      },
      {
        tomato: 100,
      },
      {
        cheese: 200,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  paperBag: {
    amountPerBox: 1000,
    id: 13,
    wholesalePrice: 0.16,
    defaultMarketPrice: 0,
    productSalesRatio: 0,
    importers: ["jetcargo", "seaside", "unitedocean", "bluestone"],
    ingredients: [
      {
        paperReam: 2,
      },
    ],
    productionRate: 500,
    workstation: "consumerGoodsWorkstation",
  },
  burger: {
    amountPerBox: 500,
    id: 19,
    wholesalePrice: 4.75,
    defaultMarketPrice: 12.5,
    productSalesRatio: 0.75,
    importers: ["jetcargo"],
    ingredients: [
      {
        groundBeef: 200,
      },
      {
        dough: 200,
      },
      {
        cheese: 40,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  expensiveGift: {
    amountPerBox: 300,
    id: 20,
    wholesalePrice: 7,
    defaultMarketPrice: 32,
    productSalesRatio: 0.5,
    importers: ["bluestone"],
    ingredients: [
      {
        water: 100,
      },
      {
        glass: 100,
      },
      {
        plastic: 250,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  frenchFries: {
    amountPerBox: 500,
    id: 22,
    wholesalePrice: 2.22,
    defaultMarketPrice: 6.25,
    productSalesRatio: 0.8,
    importers: ["jetcargo"],
    ingredients: [
      {
        russetPotatoes: 200,
      },
      {
        tomato: 50,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  freshFood: {
    amountPerBox: 500,
    id: 26,
    wholesalePrice: 2.5,
    defaultMarketPrice: 8,
    productSalesRatio: 0.55,
    importers: ["seaside"],
    ingredients: [
      {
        groundBeef: 200,
      },
      {
        russetPotatoes: 200,
      },
      {
        tomato: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  frozenFood: {
    amountPerBox: 500,
    id: 29,
    wholesalePrice: 1.1,
    defaultMarketPrice: 6,
    productSalesRatio: 0.55,
    importers: ["seaside"],
    ingredients: [
      {
        chickenBreast: 200,
      },
      {
        vinaigrette: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  cheapJewelry: {
    amountPerBox: 150,
    id: 42,
    wholesalePrice: 91,
    defaultMarketPrice: 160,
    productSalesRatio: 0.8,
    importers: ["bluestone"],
    ingredients: [
      {
        uncutGemsCheap: 60,
      },
      {
        metalBand: 60,
      },
    ],
    productionRate: 60,
    workstation: "jewelryWorkstation",
  },
  expensiveJewelry: {
    amountPerBox: 150,
    id: 43,
    wholesalePrice: 768,
    defaultMarketPrice: 1270,
    productSalesRatio: 0.175,
    importers: [],
    ingredients: [
      {
        uncutGemsExpensive: 30,
      },
      {
        metalBand: 30,
      },
    ],
    productionRate: 30,
    workstation: "jewelryWorkstation",
  },
  croissant: {
    amountPerBox: 500,
    id: 44,
    wholesalePrice: 2.91,
    defaultMarketPrice: 7.2,
    productSalesRatio: 0.45,
    importers: ["jetcargo"],
    ingredients: [
      {
        dough: 200,
      },
      {
        butter: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  cupOfCoffee: {
    amountPerBox: 500,
    id: 45,
    wholesalePrice: 0.9,
    defaultMarketPrice: 3.9,
    productSalesRatio: 0.9,
    importers: ["jetcargo"],
    ingredients: [
      {
        water: 250,
      },
      {
        groundCoffeeBeans: 250,
      },
    ],
    productionRate: 250,
    workstation: "bottledGoodsWorkstation",
  },
  cheapGift: {
    amountPerBox: 300,
    id: 47,
    wholesalePrice: 5,
    defaultMarketPrice: 18,
    productSalesRatio: 0.85,
    importers: ["bluestone"],
    ingredients: [
      {
        clay: 50,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  classicCheapMaleClothing: {
    amountPerBox: 150,
    id: 49,
    wholesalePrice: 24,
    defaultMarketPrice: 55,
    productSalesRatio: 0.5,
    importers: ["unitedocean"],
    ingredients: [
      {
        fabricCheap: 120,
      },
    ],
    productionRate: 60,
    workstation: "clothingWorkstation",
  },
  salad: {
    amountPerBox: 500,
    id: 54,
    wholesalePrice: 4.9,
    defaultMarketPrice: 13,
    productSalesRatio: 0.4,
    importers: ["jetcargo"],
    ingredients: [
      {
        vinaigrette: 100,
      },
      {
        lettuce: 200,
      },
      {
        tomato: 100,
      },
      {
        pepper: 100,
      },
      {
        onion: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  classicCheapFemaleClothing: {
    amountPerBox: 150,
    id: 61,
    wholesalePrice: 24,
    defaultMarketPrice: 55,
    productSalesRatio: 0.5,
    importers: ["unitedocean"],
    ingredients: [
      {
        fabricCheap: 120,
      },
    ],
    productionRate: 60,
    workstation: "clothingWorkstation",
  },
  cigar: {
    amountPerBox: 300,
    id: 62,
    wholesalePrice: 3.6,
    defaultMarketPrice: 12,
    productSalesRatio: 0.5,
    importers: ["unitedocean"],
    ingredients: [
      {
        cigarPaper: 20,
      },
      {
        tobacco: 100,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  modernCheapMaleClothing: {
    amountPerBox: 150,
    id: 63,
    wholesalePrice: 27,
    defaultMarketPrice: 57,
    productSalesRatio: 0.5,
    importers: ["unitedocean"],
    ingredients: [
      {
        fabricCheap: 120,
      },
    ],
    productionRate: 60,
    workstation: "clothingWorkstation",
  },
  bottleOfWine: {
    amountPerBox: 300,
    id: 64,
    wholesalePrice: 5.8,
    defaultMarketPrice: 21,
    productSalesRatio: 0.7,
    importers: ["unitedocean"],
    ingredients: [
      {
        grapes: 100,
      },
      {
        sugar: 50,
      },
      {
        yeast: 50,
      },
    ],
    productionRate: 50,
    workstation: "bottledGoodsWorkstation",
  },
  modernCheapFemaleClothing: {
    amountPerBox: 150,
    id: 65,
    wholesalePrice: 27,
    defaultMarketPrice: 57,
    productSalesRatio: 0.5,
    importers: ["unitedocean"],
    ingredients: [
      {
        fabricCheap: 120,
      },
    ],
    productionRate: 60,
    workstation: "clothingWorkstation",
  },
  classicExpensiveMaleClothing: {
    amountPerBox: 150,
    id: 67,
    wholesalePrice: 41,
    defaultMarketPrice: 122,
    productSalesRatio: 0.35,
    importers: [],
    ingredients: [
      {
        fabricExpensive: 60,
      },
    ],
    productionRate: 30,
    workstation: "clothingWorkstation",
  },
  classicExpensiveFemaleClothing: {
    amountPerBox: 150,
    id: 69,
    wholesalePrice: 41,
    defaultMarketPrice: 122,
    productSalesRatio: 0.35,
    importers: [],
    ingredients: [
      {
        fabricExpensive: 60,
      },
    ],
    productionRate: 30,
    workstation: "clothingWorkstation",
  },
  modernExpensiveMaleClothing: {
    amountPerBox: 150,
    id: 71,
    wholesalePrice: 45,
    defaultMarketPrice: 127,
    productSalesRatio: 0.35,
    importers: [],
    ingredients: [
      {
        fabricExpensive: 60,
      },
    ],
    productionRate: 30,
    workstation: "clothingWorkstation",
  },
  modernExpensiveFemaleClothing: {
    amountPerBox: 150,
    id: 73,
    wholesalePrice: 45,
    defaultMarketPrice: 127,
    productSalesRatio: 0.35,
    importers: [],
    ingredients: [
      {
        fabricExpensive: 60,
      },
    ],
    productionRate: 30,
    workstation: "clothingWorkstation",
  },
  cheapFlower: {
    amountPerBox: 100,
    id: 105,
    wholesalePrice: 6,
    defaultMarketPrice: 25,
    productSalesRatio: 0.6,
    importers: ["seaside"],
    ingredients: [
      {
        flowerCheapSeeds: 100,
      },
      {
        water: 100,
      },
    ],
    productionRate: 100,
    workstation: "gardenWorkstation",
  },
  expensiveFlower: {
    amountPerBox: 100,
    id: 106,
    wholesalePrice: 10,
    defaultMarketPrice: 40,
    productSalesRatio: 0.4,
    importers: ["seaside"],
    ingredients: [
      {
        flowerExpensiveSeeds: 100,
      },
      {
        water: 100,
      },
    ],
    productionRate: 100,
    workstation: "gardenWorkstation",
  },
  donut: {
    amountPerBox: 500,
    id: 120,
    wholesalePrice: 1.52,
    defaultMarketPrice: 3.8,
    productSalesRatio: 0.7,
    importers: ["jetcargo"],
    ingredients: [
      {
        milk: 100,
      },
      {
        sugar: 100,
      },
      {
        dough: 200,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  cupcake: {
    amountPerBox: 500,
    id: 138,
    wholesalePrice: 2.1,
    defaultMarketPrice: 5.2,
    productSalesRatio: 0.45,
    importers: ["jetcargo"],
    ingredients: [
      {
        bakingMix: 200,
      },
      {
        milk: 100,
      },
      {
        sugar: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  apple: {
    amountPerBox: 500,
    id: 177,
    wholesalePrice: 0.32,
    defaultMarketPrice: 2.89,
    productSalesRatio: 1,
    importers: ["seaside"],
    ingredients: [
      {
        appleSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  pear: {
    amountPerBox: 500,
    id: 178,
    wholesalePrice: 0.29,
    defaultMarketPrice: 2.62,
    productSalesRatio: 0.85,
    importers: ["seaside"],
    ingredients: [
      {
        pearSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  banana: {
    amountPerBox: 500,
    id: 179,
    wholesalePrice: 0.26,
    defaultMarketPrice: 2.35,
    productSalesRatio: 1,
    importers: ["seaside"],
    ingredients: [
      {
        bananaSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  carrot: {
    amountPerBox: 500,
    id: 180,
    wholesalePrice: 0.28,
    defaultMarketPrice: 2.24,
    productSalesRatio: 0.95,
    importers: ["seaside"],
    ingredients: [
      {
        carrotSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  lettuce: {
    amountPerBox: 250,
    id: 181,
    wholesalePrice: 0.28,
    defaultMarketPrice: 2.12,
    productSalesRatio: 0.9,
    importers: ["seaside", "lunartide"],
    ingredients: [
      {
        lettuceSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  tomato: {
    amountPerBox: 500,
    id: 182,
    wholesalePrice: 0.29,
    defaultMarketPrice: 2.56,
    productSalesRatio: 0.9,
    importers: ["seaside", "lunartide"],
    ingredients: [
      {
        tomatoSeeds: 50,
      },
      {
        water: 50,
      },
    ],
    productionRate: 250,
    workstation: "gardenWorkstation",
  },
  margarita: {
    amountPerBox: 300,
    id: 221,
    wholesalePrice: 4,
    defaultMarketPrice: 16,
    productSalesRatio: 0.7,
    importers: ["unitedocean"],
    ingredients: [
      {
        water: 50,
      },
      {
        barley: 50,
      },
      {
        yeast: 50,
      },
      {
        blueAgave: 100,
      },
      {
        limeJuice: 50,
      },
    ],
    productionRate: 50,
    workstation: "bottledGoodsWorkstation",
  },
  whisky: {
    amountPerBox: 300,
    id: 222,
    wholesalePrice: 8,
    defaultMarketPrice: 26,
    productSalesRatio: 0.66,
    importers: ["unitedocean"],
    ingredients: [
      {
        water: 50,
      },
      {
        barley: 100,
      },
      {
        yeast: 50,
      },
    ],
    productionRate: 50,
    workstation: "bottledGoodsWorkstation",
  },
  martini: {
    amountPerBox: 300,
    id: 223,
    wholesalePrice: 5,
    defaultMarketPrice: 20,
    productSalesRatio: 0.7,
    importers: ["unitedocean"],
    ingredients: [
      {
        water: 50,
      },
      {
        barley: 50,
      },
      {
        yeast: 50,
      },
      {
        juniperBerries: 100,
      },
      {
        vermouth: 50,
      },
    ],
    productionRate: 50,
    workstation: "bottledGoodsWorkstation",
  },
  beer: {
    amountPerBox: 300,
    id: 224,
    wholesalePrice: 2,
    defaultMarketPrice: 12,
    productSalesRatio: 0.66,
    importers: ["unitedocean"],
    ingredients: [
      {
        water: 50,
      },
      {
        barley: 50,
      },
      {
        yeast: 50,
      },
      {
        carbonDioxide: 50,
      },
      {
        hops: 50,
      },
    ],
    productionRate: 50,
    workstation: "bottledGoodsWorkstation",
  },
  hairCareProduct: {
    amountPerBox: 500,
    id: 246,
    wholesalePrice: 9,
    defaultMarketPrice: 19,
    productSalesRatio: 0.2,
    importers: ["seaside"],
    ingredients: [
      {
        water: 150,
      },
      {
        hairCareFormula: 150,
      },
    ],
    productionRate: 150,
    workstation: "bottledGoodsWorkstation",
  },
  iceCream: {
    amountPerBox: 500,
    id: 256,
    wholesalePrice: 4.33,
    defaultMarketPrice: 11.5,
    productSalesRatio: 0.35,
    importers: ["jetcargo"],
    ingredients: [
      {
        sugar: 200,
      },
      {
        milk: 200,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  artyFishPhone: {
    amountPerBox: 300,
    id: 266,
    wholesalePrice: 350,
    defaultMarketPrice: 799,
    productSalesRatio: 0.26,
    importers: [],
    ingredients: [
      {
        resistors: 300,
      },
      {
        transistors: 300,
      },
      {
        capacitors: 300,
      },
      {
        integratedCircuits: 60,
      },
      {
        copperCladLaminate: 30,
      },
      {
        speaker: 30,
      },
      {
        microphone: 30,
      },
      {
        plastic: 30,
      },
      {
        glass: 30,
      },
      {
        battery: 30,
      },
    ],
    productionRate: 30,
    workstation: "electronicsWorkstation",
  },
  zanaManPhone: {
    amountPerBox: 300,
    id: 267,
    wholesalePrice: 450,
    defaultMarketPrice: 999,
    productSalesRatio: 0.2,
    importers: [],
    ingredients: [
      {
        resistors: 300,
      },
      {
        transistors: 300,
      },
      {
        capacitors: 300,
      },
      {
        integratedCircuits: 60,
      },
      {
        copperCladLaminate: 30,
      },
      {
        speaker: 30,
      },
      {
        microphone: 30,
      },
      {
        plastic: 30,
      },
      {
        glass: 30,
      },
      {
        battery: 30,
      },
    ],
    productionRate: 30,
    workstation: "electronicsWorkstation",
  },
  zanaManSmartwatch: {
    amountPerBox: 300,
    id: 268,
    wholesalePrice: 250,
    defaultMarketPrice: 399,
    productSalesRatio: 0.14,
    importers: [],
    ingredients: [
      {
        resistors: 60,
      },
      {
        transistors: 60,
      },
      {
        capacitors: 60,
      },
      {
        integratedCircuits: 30,
      },
      {
        copperCladLaminate: 30,
      },
      {
        speaker: 30,
      },
      {
        microphone: 30,
      },
      {
        plastic: 5,
      },
      {
        glass: 5,
      },
      {
        battery: 30,
      },
    ],
    productionRate: 30,
    workstation: "electronicsWorkstation",
  },
  artyFishSmartwatch: {
    amountPerBox: 300,
    id: 269,
    wholesalePrice: 150,
    defaultMarketPrice: 324,
    productSalesRatio: 0.18,
    importers: [],
    ingredients: [
      {
        resistors: 60,
      },
      {
        transistors: 60,
      },
      {
        capacitors: 60,
      },
      {
        integratedCircuits: 30,
      },
      {
        copperCladLaminate: 30,
      },
      {
        speaker: 30,
      },
      {
        microphone: 30,
      },
      {
        plastic: 5,
      },
      {
        glass: 5,
      },
      {
        battery: 30,
      },
    ],
    productionRate: 30,
    workstation: "electronicsWorkstation",
  },
  noizeBossEarbuds: {
    amountPerBox: 600,
    id: 274,
    wholesalePrice: 79,
    defaultMarketPrice: 159,
    productSalesRatio: 0.24,
    importers: ["bluestone"],
    ingredients: [
      {
        resistors: 60,
      },
      {
        transistors: 60,
      },
      {
        capacitors: 60,
      },
      {
        integratedCircuits: 60,
      },
      {
        copperCladLaminate: 10,
      },
      {
        speaker: 120,
      },
      {
        microphone: 60,
      },
      {
        plastic: 10,
      },
    ],
    productionRate: 60,
    workstation: "electronicsWorkstation",
  },
  rhythmByTreHeadphones: {
    amountPerBox: 600,
    id: 275,
    wholesalePrice: 200,
    defaultMarketPrice: 349,
    productSalesRatio: 0.16,
    importers: ["bluestone"],
    ingredients: [
      {
        resistors: 120,
      },
      {
        transistors: 120,
      },
      {
        capacitors: 120,
      },
      {
        integratedCircuits: 60,
      },
      {
        copperCladLaminate: 20,
      },
      {
        speaker: 120,
      },
      {
        microphone: 60,
      },
      {
        plastic: 20,
      },
    ],
    productionRate: 60,
    workstation: "electronicsWorkstation",
  },
  kabob: {
    amountPerBox: 500,
    id: 276,
    wholesalePrice: 5.2,
    defaultMarketPrice: 14,
    productSalesRatio: 0.66,
    importers: ["jetcargo"],
    ingredients: [
      {
        chickenBreast: 200,
      },
      {
        vinaigrette: 100,
      },
      {
        onion: 100,
      },
      {
        pepper: 100,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  novel: {
    amountPerBox: 300,
    id: 315,
    wholesalePrice: 11.5,
    defaultMarketPrice: 28,
    productSalesRatio: 0.66,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 3,
      },
      {
        fabricCheap: 50,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  youngNovel: {
    amountPerBox: 450,
    id: 316,
    wholesalePrice: 5.5,
    defaultMarketPrice: 14,
    productSalesRatio: 0.85,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 1,
      },
      {
        fabricCheap: 20,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  motivationalBook: {
    amountPerBox: 300,
    id: 317,
    wholesalePrice: 10,
    defaultMarketPrice: 25,
    productSalesRatio: 0.7,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 3,
      },
      {
        fabricCheap: 50,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  technicalManual: {
    amountPerBox: 300,
    id: 318,
    wholesalePrice: 18,
    defaultMarketPrice: 44,
    productSalesRatio: 0.4,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 5,
      },
      {
        fabricExpensive: 50,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  pictureBook: {
    amountPerBox: 450,
    id: 319,
    wholesalePrice: 2.5,
    defaultMarketPrice: 6,
    productSalesRatio: 0.85,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 1,
      },
      {
        fabricCheap: 20,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  limitedEditionBook: {
    amountPerBox: 300,
    id: 320,
    wholesalePrice: 45,
    defaultMarketPrice: 90,
    productSalesRatio: 0.35,
    importers: ["bluestone"],
    ingredients: [
      {
        paperReam: 2,
      },
      {
        fabricExpensive: 100,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  cigarette: {
    amountPerBox: 300,
    id: 422,
    wholesalePrice: 3.2,
    defaultMarketPrice: 10,
    productSalesRatio: 0.8,
    importers: ["unitedocean"],
    ingredients: [
      {
        cigarettePaper: 20,
      },
      {
        tobacco: 100,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  umbrella: {
    amountPerBox: 300,
    id: 565,
    wholesalePrice: 7,
    defaultMarketPrice: 24,
    productSalesRatio: 0.5,
    importers: ["bluestone"],
    ingredients: [
      {
        plastic: 50,
      },
      {
        metalWire: 100,
      },
    ],
    productionRate: 100,
    workstation: "consumerGoodsWorkstation",
  },
  cheesePlatter: {
    amountPerBox: 500,
    id: 615,
    wholesalePrice: 0.1,
    defaultMarketPrice: 15,
    productSalesRatio: 0.85,
    importers: ["unitedocean"],
    ingredients: [
      {
        cheese: 200,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  cottonCandy: {
    amountPerBox: 500,
    id: 616,
    wholesalePrice: 0.1,
    defaultMarketPrice: 6.75,
    productSalesRatio: 0.85,
    importers: ["seaside"],
    ingredients: [
      {
        sugar: 200,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  popcorn: {
    amountPerBox: 500,
    id: 617,
    wholesalePrice: 0.1,
    defaultMarketPrice: 8.5,
    productSalesRatio: 0.85,
    importers: ["seaside"],
    ingredients: [
      {
        popcornKernels: 200,
      },
      {
        butter: 10,
      },
    ],
    productionRate: 200,
    workstation: "foodWorkstation",
  },
  slushie: {
    amountPerBox: 500,
    id: 619,
    wholesalePrice: 0.9,
    defaultMarketPrice: 7,
    productSalesRatio: 0.85,
    importers: ["seaside"],
    ingredients: [
      {
        water: 250,
      },
      {
        sugar: 250,
      },
      {
        flavorSyrup: 250,
      },
    ],
    productionRate: 250,
    workstation: "bottledGoodsWorkstation",
  },
  cupOfTea: {
    amountPerBox: 500,
    id: 620,
    wholesalePrice: 0.9,
    defaultMarketPrice: 3.9,
    productSalesRatio: 0.9,
    importers: ["jetcargo"],
    ingredients: [
      {
        water: 250,
      },
      {
        teaLeaves: 250,
      },
    ],
    productionRate: 250,
    workstation: "bottledGoodsWorkstation",
  },
  energyDrink: {
    amountPerBox: 500,
    id: 621,
    wholesalePrice: 0.9,
    defaultMarketPrice: 3.9,
    productSalesRatio: 0.9,
    importers: ["jetcargo"],
    ingredients: [
      {
        water: 250,
      },
      {
        sugar: 250,
      },
      {
        carbonDioxide: 250,
      },
      {
        caffeineExtract: 250,
      },
    ],
    productionRate: 250,
    workstation: "bottledGoodsWorkstation",
  },
} as const satisfies Partial<Record<ProductName, Product>>;
