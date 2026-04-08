import { usePlaythroughStore } from "../stores/playthroughStore";
import { useActivePlaythrough } from "./useActivePlaythrough";

export const usePriceIndices = () => {
  const { activePlaythrough } = useActivePlaythrough();

  return usePlaythroughStore((state) => {
    if (!activePlaythrough) return undefined;
    return state.getPriceIndices(activePlaythrough.id);
  });
};
