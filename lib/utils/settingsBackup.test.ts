import { get, set } from "idb-keyval";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { useAppStore } from "../stores/appStore";
import { usePlaythroughStore } from "../stores/playthroughStore";
import {
  exportSettingsBackup,
  importSettingsBackup,
  parseSettingsBackup,
} from "./settingsBackup";

const setupBackup = () => {
  const store = usePlaythroughStore.getState();
  const playthrough = store.createPlaythrough({
    characterName: "Morgan",
    difficulty: "normal",
    gameVersion: "1.0",
  });
  const factory = store.createFactory({
    ..._testFactoryFormValues,
    workstations: [
      {
        name: "foodWorkstation",
        product: "hotdog",
        amount: 25,
        productionLimit: 1000,
      },
    ],
  });
  store.addFactoryToPlaythrough(playthrough.id, factory.id);
  const group = store.createFactoryGroup(playthrough.id, {
    name: "Bakery",
    color: "#abcdef",
  });
  store.addFactoryToGroup(playthrough.id, factory.id, group.id);
  store.setPriceIndex(playthrough.id, "hotdog", 1.2);
  store.setTemplateFactory(factory);
  usePlaythroughStore.setState({ _hasHydrated: true });
  useAppStore.setState({
    _hasHydrated: true,
    difficulty: "hard",
    gameVersion: "0.11",
    calculationPeriod: "daily",
    tablePriceIndex: 1.1,
    displayPrices: { source: "IMPORT", target: "RETAIL" },
  });
  return { backup: JSON.parse(exportSettingsBackup()), factory, playthrough };
};

describe("settings backup", () => {
  it("round-trips both stores, factory groups, production limits, price indices and templates", async () => {
    const { backup, factory, playthrough } = setupBackup();
    const expectedPlaythrough = usePlaythroughStore.getState().playthroughs;
    usePlaythroughStore.setState({
      playthroughs: [],
      factories: [],
      templateFactory: undefined,
    });
    useAppStore.getState().setDifficulty("easy");
    await importSettingsBackup(JSON.stringify(backup));
    expect(usePlaythroughStore.getState().playthroughs).toEqual(
      expectedPlaythrough,
    );
    expect(usePlaythroughStore.getState().getFactoryById(factory.id)).toEqual(
      factory,
    );
    expect(
      usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
        ?.priceIndices.hotdog,
    ).toBe(1.2);
    expect(usePlaythroughStore.getState().templateFactory).toEqual(factory);
    expect(useAppStore.getState()).toMatchObject({
      difficulty: "hard",
      gameVersion: "0.11",
      calculationPeriod: "daily",
      tablePriceIndex: 1.1,
      displayPrices: { source: "IMPORT", target: "RETAIL" },
    });
    expect(await get("playthrough-storage")).toBe(
      backup["playthrough-storage"],
    );
    expect(localStorage.getItem("app-storage")).toBe(backup["app-storage"]);
  });

  it("exports only the two application stores and strips runtime flags and actions", async () => {
    await set("unrelated-cache", "do not export");
    const { backup } = setupBackup();
    expect(Object.keys(backup).sort()).toEqual([
      "app-storage",
      "playthrough-storage",
    ]);
    expect(exportSettingsBackup()).not.toContain("_hasHydrated");
    expect(exportSettingsBackup()).not.toContain("getFactoryById");
    expect(exportSettingsBackup()).not.toContain("unrelated-cache");
  });

  it("snapshots live changes even while IndexedDB has not persisted them yet", async () => {
    const { factory } = setupBackup();
    const persisted = await get("playthrough-storage");
    let finishWrite!: () => void;
    vi.mocked(set).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishWrite = resolve;
        }),
    );
    usePlaythroughStore.getState().editFactory(factory.id, {
      workstations: [{ ...factory.workstations[0], productionLimit: 2000 }],
    });
    try {
      const backup = JSON.parse(exportSettingsBackup());
      const state = JSON.parse(backup["playthrough-storage"]).state;
      expect(state.factories[0].workstations[0].productionLimit).toBe(2000);
      expect(await get("playthrough-storage")).toBe(persisted);
    } finally {
      finishWrite();
    }
  });

  it("accepts the original PR's playthrough-only backup without changing app preferences", async () => {
    const { backup } = setupBackup();
    const preferences = localStorage.getItem("app-storage");
    await importSettingsBackup(
      JSON.stringify({ "playthrough-storage": backup["playthrough-storage"] }),
    );
    expect(localStorage.getItem("app-storage")).toBe(preferences);
    expect(useAppStore.getState().difficulty).toBe("hard");
  });

  it("normalizes legacy storage versions and missing game versions before restore", async () => {
    const { backup } = setupBackup();
    const envelope = JSON.parse(backup["playthrough-storage"]);
    envelope.version = 0;
    delete envelope.state.playthroughs[0].gameVersion;
    await importSettingsBackup(
      JSON.stringify({ "playthrough-storage": JSON.stringify(envelope) }),
    );
    expect(usePlaythroughStore.getState().playthroughs[0].gameVersion).toBe(
      "0.10",
    );
  });

  it("clears a previous factory template when the restored backup has none", async () => {
    const { backup } = setupBackup();
    const envelope = JSON.parse(backup["playthrough-storage"]);
    delete envelope.state.templateFactory;
    await importSettingsBackup(
      JSON.stringify({ "playthrough-storage": JSON.stringify(envelope) }),
    );
    expect(usePlaythroughStore.getState().templateFactory).toBeUndefined();
    expect(
      JSON.parse((await get("playthrough-storage"))!).state.templateFactory,
    ).toBeUndefined();
  });

  it.each([
    "future version",
    "invalid factories",
    "missing factory",
    "duplicate factory",
    "invalid group",
    "wrong workstation",
    "unknown game version",
    "negative quantity",
  ])(
    "rejects %s before any persistent write or live state update",
    async (caseName) => {
      const { backup } = setupBackup();
      const originalLiveState = usePlaythroughStore.getState();
      const originalAppStorage = localStorage.getItem("app-storage");
      const envelope = JSON.parse(backup["playthrough-storage"]);
      const state = envelope.state;
      switch (caseName) {
        case "future version":
          envelope.version = 99;
          break;
        case "invalid factories":
          state.factories = "broken";
          break;
        case "missing factory":
          state.playthroughs[0].factoryIds.push("missing");
          break;
        case "duplicate factory":
          state.factories.push(state.factories[0]);
          break;
        case "invalid group":
          state.playthroughs[0].factoryGroups[0].factoryIds.push("missing");
          break;
        case "wrong workstation":
          state.factories[0].workstations[0].name = "clothingWorkstation";
          break;
        case "unknown game version":
          state.playthroughs[0].gameVersion = "future";
          break;
        case "negative quantity":
          state.factories[0].workstations[0].amount = -1;
          break;
      }
      backup["playthrough-storage"] = JSON.stringify(envelope);
      vi.mocked(set).mockClear();
      await expect(
        importSettingsBackup(JSON.stringify(backup)),
      ).rejects.toThrow();
      expect(set).not.toHaveBeenCalled();
      expect(usePlaythroughStore.getState()).toBe(originalLiveState);
      expect(localStorage.getItem("app-storage")).toBe(originalAppStorage);
    },
  );

  it("validates app settings before committing valid playthrough data", async () => {
    const { backup } = setupBackup();
    backup["app-storage"] = JSON.stringify({
      version: 1,
      state: { difficulty: "impossible" },
    });
    vi.mocked(set).mockClear();
    await expect(
      importSettingsBackup(JSON.stringify(backup)),
    ).rejects.toThrow();
    expect(set).not.toHaveBeenCalled();
  });

  it("rolls back app preferences and leaves live data unchanged when IndexedDB rejects the write", async () => {
    const { backup } = setupBackup();
    useAppStore.getState().setDifficulty("easy");
    const previousLocalStorage = localStorage.getItem("app-storage");
    const previousLiveState = usePlaythroughStore.getState();
    const previousIndexedDb = await get("playthrough-storage");
    vi.mocked(set).mockRejectedValueOnce(new Error("Quota exceeded"));
    await expect(importSettingsBackup(JSON.stringify(backup))).rejects.toThrow(
      "Quota exceeded",
    );
    expect(localStorage.getItem("app-storage")).toBe(previousLocalStorage);
    expect(usePlaythroughStore.getState()).toBe(previousLiveState);
    expect(await get("playthrough-storage")).toBe(previousIndexedDb);
  });

  it("leaves IndexedDB unchanged when writing app preferences fails", async () => {
    const { backup } = setupBackup();
    vi.mocked(set).mockClear();
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("Quota exceeded");
    });
    await expect(importSettingsBackup(JSON.stringify(backup))).rejects.toThrow(
      "Quota exceeded",
    );
    expect(set).not.toHaveBeenCalled();
  });

  it("rejects unrelated storage keys instead of importing them", () => {
    const { backup } = setupBackup();
    expect(() =>
      parseSettingsBackup(
        JSON.stringify({ ...backup, "unrelated-cache": "bad" }),
      ),
    ).toThrow();
  });

  it("refuses to export before the stores have hydrated", () => {
    expect(exportSettingsBackup).toThrow("still loading");
  });
});
