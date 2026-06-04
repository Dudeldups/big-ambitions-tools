import { gameData as gameData010 } from "@/data/game/0.10";
import { gameData as gameData011 } from "@/data/game/0.11";
import { GameData } from "./types";
import { GameVersion } from "./versions";

export const GAME_DATA_BY_VERSION: Partial<Record<GameVersion, GameData>> = {
  "0.10": gameData010,
  "0.11": gameData011,
};

export const getGameData = (version: GameVersion): GameData => {
  const gameData = GAME_DATA_BY_VERSION[version];

  if (!gameData) {
    throw new Error(`Game data for version ${version} is not available.`);
  }

  return gameData;
};

export const getPlaythroughGameData = (owner: {
  gameVersion: GameVersion;
}): GameData => getGameData(owner.gameVersion);
