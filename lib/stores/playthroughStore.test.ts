import { _testFactoryFormValues } from "@/__tests__/test-values";
import { BASE_PRODUCT_PRICE_INDEX } from "../constants";
import { products } from "../game/products";
import { usePlaythroughStore } from "./playthroughStore";

describe("usePlaythroughStore", () => {
  it("creates playthroughs with default price indices and keeps only the newest one active", () => {
    const first = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "easy",
      gameVersion: "0.10",
    });

    const second = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Sam",
      difficulty: "hard",
      gameVersion: "0.10",
    });

    const state = usePlaythroughStore.getState();
    const persistedProductNames = Object.entries(products)
      .filter(([, product]) => product.defaultMarketPrice > 0)
      .map(([name]) => name);

    expect(state.playthroughs).toHaveLength(2);
    expect(state.playthroughs[0].id).toBe(second.id);
    expect(state.playthroughs[0].isActive).toBe(true);
    expect(state.playthroughs[0].gameVersion).toBe("0.10");
    expect(state.playthroughs[1].id).toBe(first.id);
    expect(state.playthroughs[1].isActive).toBe(false);
    expect(state.playthroughs[1].gameVersion).toBe("0.10");

    expect(Object.keys(first.priceIndices).sort()).toEqual(
      persistedProductNames.sort(),
    );
    expect(first.priceIndices.classicCheapMaleClothing).toBe(
      BASE_PRODUCT_PRICE_INDEX,
    );
  });

  it("keeps playthrough, factory and group relationships in sync", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "normal",
      gameVersion: "0.10",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Bakery",
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);

    const group = usePlaythroughStore
      .getState()
      .createFactoryGroup(playthrough.id, {
        name: "Downtown",
        color: "#fff",
      });

    usePlaythroughStore
      .getState()
      .addFactoryToGroup(playthrough.id, factory.id, group.id);

    expect(
      usePlaythroughStore.getState().getGroupById(playthrough.id, group.id),
    ).toMatchObject({
      id: group.id,
      factoryIds: [factory.id],
    });

    usePlaythroughStore.getState().deleteFactory(factory.id, playthrough.id);

    const updatedPlaythrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthrough.id);

    expect(usePlaythroughStore.getState().getFactoryById(factory.id)).toBe(
      undefined,
    );
    expect(updatedPlaythrough?.factoryIds).toEqual([]);
    expect(updatedPlaythrough?.factoryGroups[0]?.factoryIds).toEqual([]);
  });

  it("rehydrates persisted playthrough data from IndexedDB storage", async () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Chris",
      difficulty: "hard",
      gameVersion: "0.10",
    });

    usePlaythroughStore
      .getState()
      .setPriceIndex(playthrough.id, "classicCheapMaleClothing", 1.3);

    const persistedState = await usePlaythroughStore.persist
      .getOptions()
      .storage?.getItem("playthrough-storage");

    expect(persistedState).toMatchObject({
      version: 1,
      state: {
        playthroughs: [
          expect.objectContaining({
            id: playthrough.id,
            characterName: "Chris",
            difficulty: "hard",
            gameVersion: "0.10",
            priceIndices: expect.objectContaining({
              classicCheapMaleClothing: 1.3,
            }),
          }),
        ],
      },
    });
    expect(JSON.stringify(persistedState)).not.toContain("_hasHydrated");

    usePlaythroughStore.setState({ _hasHydrated: false });

    await usePlaythroughStore.persist.rehydrate();

    const hydratedPlaythrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthrough.id);

    expect(usePlaythroughStore.getState()._hasHydrated).toBe(true);
    expect(hydratedPlaythrough).toMatchObject({
      id: playthrough.id,
      characterName: "Chris",
      difficulty: "hard",
      gameVersion: "0.10",
    });
    expect(hydratedPlaythrough?.priceIndices.classicCheapMaleClothing).toBe(
      1.3,
    );
  });
});
