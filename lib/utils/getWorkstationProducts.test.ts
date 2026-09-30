import { getGameData } from "../game/registry";
import { GAME_VERSIONS } from "../game/versions";
import { WORKSTATION_NAMES } from "../game/machineNames";
import { getWorkstationProducts } from "./getWorkstationProducts";

describe("getWorkstationProducts", () => {
  it.each(GAME_VERSIONS)(
    "matches each product to its exact workstation in %s",
    (version) => {
      const { products } = getGameData(version);
      const matches = WORKSTATION_NAMES.flatMap((name) => {
        const result = getWorkstationProducts(name, products);
        expect(
          result.every(([, product]) => product.workstation === name),
        ).toBe(true);
        return result.map(([productName]) => productName);
      });
      expect(matches.sort()).toEqual(Object.keys(products).sort());
    },
  );
});
