import { useParams } from "next/navigation";
import { Playthrough, usePlaythroughStore } from "../stores/playthroughStore";

export function useActivePlaythrough() {
  const params = useParams<{ playthroughId: string }>();
  const { playthroughId } = params;

  const hasHydrated = usePlaythroughStore((state) => state._hasHydrated);

  const activePlaythrough = usePlaythroughStore((s) =>
    s.getPlaythroughById(playthroughId),
  );

  return {
    isLoading: !hasHydrated,
    isInvalid: hasHydrated && !activePlaythrough,
    activePlaythrough: activePlaythrough as Playthrough,
  };
}
