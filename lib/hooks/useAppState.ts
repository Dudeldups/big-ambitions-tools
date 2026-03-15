import { AppActions, AppState, useAppStore } from "../store/appStore";

export function useAppState<T>(
  selector: (state: AppState & AppActions) => T,
): T | null {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const value = useAppStore(selector);

  return hasHydrated ? value : null;
}
