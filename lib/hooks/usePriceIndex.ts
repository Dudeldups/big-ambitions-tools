import { ProductName } from "../game/productNames";
import { usePlaythroughStore } from "../stores/playthroughStore";
import { useActivePlaythrough } from "./useActivePlaythrough";

export const usePriceIndex = (productName: ProductName) => {
  const { activePlaythrough } = useActivePlaythrough();

  return usePlaythroughStore(
    (state) => state.getPriceIndices(activePlaythrough.id)[productName],
  );
};
