import { gameData as gameData010 } from "@/data/game/0.10";
import { GameData } from "./types";
import { GameVersion } from "./versions";

export type GameDataOwner = {
  gameVersion: GameVersion;
};

export const GAME_DATA_BY_VERSION: Partial<Record<GameVersion, GameData>> = {
  "0.10": gameData010,
};

export const getGameData = (version: GameVersion): GameData => {
  const gameData = GAME_DATA_BY_VERSION[version];

  if (!gameData) {
    throw new Error(`Game data for version ${version} is not available.`);
  }

  return gameData;
};

export const getPlaythroughGameData = ({
  gameVersion,
}: GameDataOwner): GameData => getGameData(gameVersion);
