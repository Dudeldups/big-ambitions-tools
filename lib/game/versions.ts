export const GAME_VERSIONS = ["0.10", "0.11"] as const;

export type GameVersion = (typeof GAME_VERSIONS)[number];

type GameVersionStatus = "stable" | "experimental" | "archived";

export type GameVersionMeta = {
  id: GameVersion;
  status: GameVersionStatus;
};

export const GAME_VERSION_META = {
  "0.10": {
    id: "0.10",
    status: "stable",
  },
  "0.11": {
    id: "0.11",
    status: "stable",
  },
} satisfies Record<GameVersion, GameVersionMeta>;

export const getGameVersionMeta = (version: GameVersion): GameVersionMeta => {
  return GAME_VERSION_META[version];
};

export const getGameVersionLabel = (version: GameVersion): string => {
  const { status } = getGameVersionMeta(version);
  return status === "experimental" ? `${version} (experimental)` : version;
};

export const SELECTABLE_GAME_VERSIONS = GAME_VERSIONS.filter(
  (version) => getGameVersionMeta(version).status !== "archived",
);

const latestStableGameVersion = [...GAME_VERSIONS]
  .reverse()
  .find((version) => getGameVersionMeta(version).status === "stable");

if (!latestStableGameVersion) {
  throw new Error("At least one stable game version is required.");
}

export const DEFAULT_GAME_VERSION: GameVersion = latestStableGameVersion;
