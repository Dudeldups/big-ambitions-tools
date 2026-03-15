import { useSyncExternalStore } from "react";
import { AppActions, AppState, useAppStore } from "../store/appStore";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useAppState<T>(
  selector: (state: AppState & AppActions) => T,
): T | null {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const value = useAppStore(selector);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return mounted && hasHydrated ? value : null;
}
