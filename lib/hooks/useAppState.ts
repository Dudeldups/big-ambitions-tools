import { AppActions, AppState, useAppStore } from "../stores/appStore";

export function useAppState<T>(
  selector: (state: AppState & AppActions) => T,
): T | null {
  const hasHydrated = useAppStore((s) => s._hasHydrated);

  const value = useAppStore(selector);

  if (!hasHydrated) return null;

  return value;
}
