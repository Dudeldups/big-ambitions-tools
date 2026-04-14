import { useEffect, useRef } from "react";

type Params = {
  selectedProduct: string;
  productionAmount: number;
  salesAmount: number | undefined;
};

export function useMaxSalesAmount({
  selectedProduct,
  productionAmount,
  salesAmount,
  onPreserve,
}: Params & { onPreserve: () => void }) {
  const prevProduct = useRef(selectedProduct);
  const prevProduction = useRef(productionAmount);
  const prevSales = useRef(salesAmount);

  useEffect(() => {
    const productChanged = prevProduct.current !== selectedProduct;

    if (productChanged) {
      const wasMaxed = prevSales.current === prevProduction.current;

      if (wasMaxed) {
        onPreserve();
      }
    }

    prevProduct.current = selectedProduct;
    prevProduction.current = productionAmount;
    prevSales.current = salesAmount;
  }, [selectedProduct, productionAmount, salesAmount, onPreserve]);
}
