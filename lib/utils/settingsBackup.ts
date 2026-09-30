import { set } from "idb-keyval";
import { z } from "zod";
import {
  CALCULATION_PERIODS,
  DIFFICULTY_OPTIONS,
  DISPLAY_PRICE_OPTIONS,
} from "../constants";
import { PRODUCT_NAMES } from "../game/productNames";
import { getGameData } from "../game/registry";
import {
  DEFAULT_GAME_VERSION,
  GAME_VERSIONS,
  GameVersion,
} from "../game/versions";
import { factorySchema } from "../schemas/factory";
import { factoryGroupSchema } from "../schemas/factoryGroup";
import { playthroughSchema } from "../schemas/playthrough";
import { useAppStore } from "../stores/appStore";
import { usePlaythroughStore } from "../stores/playthroughStore";

const factory = factorySchema.extend({
  id: z.string().min(1),
  createdAt: z.number().nonnegative(),
});
const playthrough = playthroughSchema.extend({
  id: z.string().min(1),
  createdAt: z.number().nonnegative(),
  isActive: z.boolean(),
  gameVersion: z.enum(GAME_VERSIONS).default("0.10"),
  factoryIds: z.array(z.string()),
  factoryGroups: z.array(
    factoryGroupSchema.extend({
      id: z.string().min(1),
      factoryIds: z.array(z.string()),
    }),
  ),
  priceIndices: z.partialRecord(
    z.enum(PRODUCT_NAMES),
    z.number().nonnegative(),
  ),
});
const playthroughState = z.object({
  playthroughs: z.array(playthrough),
  factories: z.array(factory),
  templateFactory: factory.optional(),
});
const appState = z.object({
  difficulty: z.enum(DIFFICULTY_OPTIONS),
  gameVersion: z.enum(GAME_VERSIONS).default(DEFAULT_GAME_VERSION),
  hasSeenGameVersionNotice: z.boolean().default(false),
  displayPrices: z.object({
    source: z.enum(Object.values(DISPLAY_PRICE_OPTIONS.SOURCE)),
    target: z.enum(Object.values(DISPLAY_PRICE_OPTIONS.TARGET)),
  }),
  calculationPeriod: z.enum(CALCULATION_PERIODS),
  tablePriceIndex: z.number().nonnegative(),
});
const backupSchema = z
  .object({
    "playthrough-storage": z.string(),
    "app-storage": z.string().optional(),
  })
  .strict();

const parseStorage = <T extends z.ZodType>(value: string, stateSchema: T) => {
  // Normalize supported Zustand versions before hydration; never accept future versions.
  const envelope = z
    .object({
      version: z.union([z.literal(0), z.literal(1)]).default(0),
      state: z.unknown(),
    })
    .parse(JSON.parse(value));
  return stateSchema.parse(envelope.state) as z.output<T>;
};

const unique = (ids: string[]) => new Set(ids).size === ids.length;
type BackupFactory = z.output<typeof factory>;

const supportsFactory = (value: BackupFactory, version: GameVersion) => {
  const data = getGameData(version);
  return (
    value.workstations.every(
      (station) => data.products[station.product]?.workstation === station.name,
    ) && value.vehicles.every((vehicle) => !!data.vehicles[vehicle.name])
  );
};

export const parseSettingsBackup = (text: string) => {
  const backup = backupSchema.parse(JSON.parse(text));
  const state = parseStorage(backup["playthrough-storage"], playthroughState);
  if (
    !unique(state.factories.map((f) => f.id)) ||
    !unique(state.playthroughs.map((p) => p.id)) ||
    state.playthroughs.filter((p) => p.isActive).length > 1
  )
    throw new Error("Duplicate backup IDs or active playthroughs");
  const factories = new Map(state.factories.map((f) => [f.id, f]));
  for (const p of state.playthroughs) {
    if (
      !unique(p.factoryIds) ||
      !unique(p.factoryGroups.map((g) => g.id)) ||
      p.factoryIds.some(
        (id) =>
          !factories.has(id) ||
          !supportsFactory(factories.get(id)!, p.gameVersion),
      ) ||
      !unique(p.factoryGroups.flatMap((g) => g.factoryIds)) ||
      p.factoryGroups.some((g) =>
        g.factoryIds.some((id) => !p.factoryIds.includes(id)),
      )
    ) {
      throw new Error("Invalid factory references or game data in backup");
    }
  }
  for (const f of [
    ...state.factories,
    ...(state.templateFactory ? [state.templateFactory] : []),
  ]) {
    if (!GAME_VERSIONS.some((version) => supportsFactory(f, version)))
      throw new Error("Invalid factory game data in backup");
  }
  return {
    "playthrough-storage": JSON.stringify({ state, version: 1 }),
    ...(backup["app-storage"] !== undefined
      ? {
          "app-storage": JSON.stringify({
            state: parseStorage(backup["app-storage"], appState),
            version: 1,
          }),
        }
      : {}),
  };
};

export const exportSettingsBackup = () => {
  if (
    !useAppStore.getState()._hasHydrated ||
    !usePlaythroughStore.getState()._hasHydrated
  ) {
    throw new Error("Settings are still loading");
  }
  const playthroughOptions = usePlaythroughStore.persist.getOptions();
  const appOptions = useAppStore.persist.getOptions();
  // Snapshot both live stores, including changes whose IndexedDB write is pending.
  return JSON.stringify(
    parseSettingsBackup(
      JSON.stringify({
        "playthrough-storage": JSON.stringify({
          state: playthroughOptions.partialize!(usePlaythroughStore.getState()),
          version: playthroughOptions.version,
        }),
        "app-storage": JSON.stringify({
          state: appOptions.partialize!(useAppStore.getState()),
          version: appOptions.version,
        }),
      }),
    ),
    null,
    2,
  );
};

export const importSettingsBackup = async (text: string) => {
  const backup = parseSettingsBackup(text);
  const previousApp = localStorage.getItem("app-storage");
  // Write localStorage first and roll it back if the single atomic IndexedDB write fails.
  // Update the live stores only after both persistent writes succeed.
  try {
    if (backup["app-storage"] !== undefined)
      localStorage.setItem("app-storage", backup["app-storage"]);
    await set("playthrough-storage", backup["playthrough-storage"]);
  } catch (error) {
    if (backup["app-storage"] !== undefined) {
      if (previousApp === null) localStorage.removeItem("app-storage");
      else localStorage.setItem("app-storage", previousApp);
    }
    throw error;
  }
  const restored = parseStorage(
    backup["playthrough-storage"],
    playthroughState,
  );
  usePlaythroughStore.setState({
    ...restored,
    templateFactory: restored.templateFactory,
    _hasHydrated: true,
  });
  if (backup["app-storage"] !== undefined) {
    useAppStore.setState({
      ...parseStorage(backup["app-storage"], appState),
      _hasHydrated: true,
    });
  }
};
