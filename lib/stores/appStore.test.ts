import { DISPLAY_PRICE_OPTIONS } from "../constants";
import { initialAppState, useAppStore } from "./appStore";

describe("useAppStore", () => {
  it("updates app preferences through its actions", () => {
    const store = useAppStore.getState();

    store.setDifficulty("hard");
    store.setDisplayPrices(
      DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
      DISPLAY_PRICE_OPTIONS.TARGET.RETAIL,
    );
    store.setCalculationPeriod("daily");
    store.setTablePriceIndex(1.2);

    expect(useAppStore.getState()).toMatchObject({
      ...initialAppState,
      difficulty: "hard",
      displayPrices: {
        source: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
        target: DISPLAY_PRICE_OPTIONS.TARGET.RETAIL,
      },
      calculationPeriod: "daily",
      tablePriceIndex: 1.2,
    });
  });

  it("rehydrates persisted values and marks the store as hydrated", async () => {
    const store = useAppStore.getState();

    store.setDifficulty("normal");
    store.setTablePriceIndex(1.15);

    const persistedState = localStorage.getItem("app-storage");
    expect(persistedState).toContain('"difficulty":"normal"');
    expect(persistedState).not.toContain("_hasHydrated");

    useAppStore.setState({ _hasHydrated: false });

    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState()).toMatchObject({
      _hasHydrated: true,
      difficulty: "normal",
      tablePriceIndex: 1.15,
    });
  });
});
