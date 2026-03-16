import {
  PlaythroughActions,
  PlaythroughState,
  usePlaythroughStore,
} from "../stores/playthroughStore";

export function usePlaythroughState<T>(
  selector: (state: PlaythroughState & PlaythroughActions) => T,
): T | null {
  const hasHydrated = usePlaythroughStore((s) => s._hasHydrated);

  const value = usePlaythroughStore(selector);

  if (!hasHydrated) return null;

  return value;
}
