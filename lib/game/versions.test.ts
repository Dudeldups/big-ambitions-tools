import {
  DEFAULT_GAME_VERSION,
  GAME_VERSIONS,
  getGameVersionLabel,
  getGameVersionMeta,
  SELECTABLE_GAME_VERSIONS,
} from "./versions";

describe("game versions", () => {
  it("uses the latest stable version by default", () => {
    expect(DEFAULT_GAME_VERSION).toBe("1.0");
  });

  it("keeps archived versions available for existing playthroughs but not selection", () => {
    expect(GAME_VERSIONS).toContain("0.10");
    expect(getGameVersionMeta("0.10").status).toBe("archived");
    expect(getGameVersionLabel("0.10")).toBe("0.10 (archived)");
    expect(SELECTABLE_GAME_VERSIONS).toEqual(["0.11", "1.0"]);
  });
});
