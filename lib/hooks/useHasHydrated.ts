import { usePlaythroughStore } from "../stores/playthroughStore";

export const useHasHydrated = () => usePlaythroughStore((s) => s._hasHydrated);
