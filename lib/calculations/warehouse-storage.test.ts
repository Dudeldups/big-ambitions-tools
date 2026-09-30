import { _testFactoryFormValues } from "@/__tests__/test-values";
import { getGameData } from "../game/registry";
import { GAME_VERSIONS } from "../game/versions";
import { Factory } from "../stores/playthroughStore";
import { getMissingPalletShelvesTotal } from "./getMissingPalletShelvesTotal";

const factory: Factory = {
  ..._testFactoryFormValues,
  id: "central",
  createdAt: 0,
  openingHours: 24,
  shelfAmount: 63,
  workstations: [
    {
      name: "foodWorkstation",
      product: "hotdog",
      amount: 25,
      productionLimit: 1000,
    },
  ],
};

describe.each(GAME_VERSIONS)(
  "warehouse storage regression for PR #3 in game %s",
  (version) => {
    const gameData = getGameData(version);

    it("applies production limits and rounds boxes after combining all factories", () => {
      const factories = Array.from({ length: 14 }, (_, index) => ({
        ...factory,
        id: `factory-${index}`,
      }));
      // 14,000 sausages + 14,000 dough + 3,500 tomatoes = 63 boxes at 500 units.
      // At 60 boxes per shelf, the shared warehouse needs two shelves.
      expect(getMissingPalletShelvesTotal(factories, gameData)).toBe(2);
    });

    it("excludes direct purchases while retaining centralized orders despite local shelf space", () => {
      const direct = {
        ...factory,
        id: "direct",
        employees: {
          ...factory.employees,
          purchasingAgent: { amount: 1, salary: 80 },
        },
      };
      // The central factory orders 1,000 + 1,000 + 250 units; the direct buyer uses its local shelves.
      expect(
        getMissingPalletShelvesTotal([factory, direct, undefined], gameData),
      ).toBe(1);
      expect(getMissingPalletShelvesTotal([direct], gameData)).toBeCloseTo(0);
    });

    it("needs no warehouse shelves when all factory production is paused", () => {
      const paused = {
        ...factory,
        workstations: [{ ...factory.workstations[0], productionLimit: 0 }],
      };
      expect(
        getMissingPalletShelvesTotal([paused, undefined], gameData),
      ).toBeCloseTo(0);
    });
  },
);
