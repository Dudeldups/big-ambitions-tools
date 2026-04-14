import { useEffect, useRef } from "react";
import { ProductName } from "../game/productNames";
import { Product } from "../game/products";

type Params = {
  selectedWorkstation: string;
  productData: (Product & { name: string })[];
  onProductChange: (product: ProductName) => void;
};

export function useSyncProductWithWorkstation({
  selectedWorkstation,
  productData,
  onProductChange,
}: Params) {
  const prevWorkstation = useRef(selectedWorkstation);

  useEffect(() => {
    const changed = prevWorkstation.current !== selectedWorkstation;

    if (!changed) return;

    const firstProduct = productData.find(
      (p) => p.workstation === selectedWorkstation,
    )?.name;

    if (firstProduct) {
      onProductChange(firstProduct as ProductName);
    }

    prevWorkstation.current = selectedWorkstation;
  }, [selectedWorkstation, productData, onProductChange]);
}
