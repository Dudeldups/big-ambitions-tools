import { renderHook } from "@testing-library/react";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { useAppState } from "./useAppState";
import { usePlaythroughState } from "./usePlaythroughState";
import { useActivePlaythrough } from "./useActivePlaythrough";
import { DEFAULT_GAME_VERSION } from "../game/versions";
import { useAppStore } from "../stores/appStore";
import { usePlaythroughStore } from "../stores/playthroughStore";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));

describe("store hooks", () => {
  it("returns null from state hooks until the stores have hydrated", () => {
    useAppStore.setState({ _hasHydrated: false, difficulty: "hard" });
    usePlaythroughStore.setState({ _hasHydrated: false });

    const { result: appResult } = renderHook(() =>
      useAppState((state) => state.difficulty),
    );
    const { result: playthroughResult } = renderHook(() =>
      usePlaythroughState((state) => state.playthroughs),
    );

    expect(appResult.current).toBeNull();
    expect(playthroughResult.current).toBeNull();
  });

  it("returns selected values after hydration", () => {
    useAppStore.setState({ _hasHydrated: true, difficulty: "normal" });

    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "easy",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });

    const { result: appResult } = renderHook(() =>
      useAppState((state) => state.difficulty),
    );
    const { result: playthroughResult } = renderHook(() =>
      usePlaythroughState((state) => state.getPlaythroughById(playthrough.id)),
    );

    expect(appResult.current).toBe("normal");
    expect(playthroughResult.current?.characterName).toBe("Jordan");
  });

  it("resolves the active playthrough from the route params", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Taylor",
      difficulty: "hard",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    const { result } = renderHook(() => useActivePlaythrough());

    expect(result.current).toMatchObject({
      isLoading: false,
      isInvalid: false,
      activePlaythrough: expect.objectContaining({
        id: playthrough.id,
        characterName: "Taylor",
      }),
    });
  });

  it("marks an unknown route playthrough as invalid once hydrated", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    const { result } = renderHook(() => useActivePlaythrough());

    expect(result.current).toMatchObject({
      isLoading: false,
      isInvalid: true,
      activePlaythrough: undefined,
    });
  });
});
