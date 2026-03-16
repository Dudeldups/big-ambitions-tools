import {
  GameSaveActions,
  GameSaveState,
  useGameSaveStore,
} from "../stores/gameSaveStore";

export function useGameSaveState<T>(
  selector: (state: GameSaveState & GameSaveActions) => T,
): T | null {
  const hasHydrated = useGameSaveStore((s) => s._hasHydrated);

  const value = useGameSaveStore(selector);

  if (!hasHydrated) return null;

  return value;
}
