import { useParams } from "next/navigation";
import { Factory, usePlaythroughStore } from "../stores/playthroughStore";

export function useActiveFactory() {
  const params = useParams<{ playthroughId: string; factoryId: string }>();
  const { factoryId } = params;

  const hasHydrated = usePlaythroughStore((state) => state._hasHydrated);

  const activeFactory = usePlaythroughStore((s) => s.getFactoryById(factoryId));

  return {
    isLoading: !hasHydrated,
    isInvalid: hasHydrated && !activeFactory,
    activeFactory: activeFactory as Factory,
  };
}
