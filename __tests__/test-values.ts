import { FactoryFormValues } from "@/lib/schemas/factory";

export const _testFactoryFormValues: FactoryFormValues = {
  name: "Example Factory",
  description: "This is a test factory.",
  openingHours: 12,
  shelfAmount: 50,
  employees: {
    deliveryDriver: {
      amount: 1,
      salary: 50,
    },
    hrManager: {
      amount: 0,
      salary: 80,
    },
    logisticsManager: {
      amount: 1,
      salary: 80,
    },
    purchasingAgent: {
      amount: 0,
      salary: 80,
    },
    factoryWorker: {
      amount: 20,
      salary: 25,
    },
  },
  vehicles: [{ name: "FreightTruckT1" }],
  workstations: [
    {
      amount: 3,
      name: "clothingWorkstation",
      product: "classicCheapMaleClothing",
      salesAmount: 1000,
    },
    {
      amount: 1,
      name: "electronicsWorkstation",
      product: "artyFishPhone",
    },
  ],
};
