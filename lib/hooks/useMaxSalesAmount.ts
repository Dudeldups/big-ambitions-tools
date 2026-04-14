import { useEffect, useRef, useState } from "react";

type Params = {
  selectedProduct: string;
  productionAmount: number;
  salesAmount: number | undefined;
};

export function useMaxSalesAmount({
  selectedProduct,
  productionAmount,
  salesAmount = 0,
}: Params) {
  const prevProduct = useRef(selectedProduct);
  const prevProduction = useRef(productionAmount);
  const prevSales = useRef(salesAmount);

  const [wasMaxedOnChange, setWasMaxedOnChange] = useState(false);

  useEffect(() => {
    const productChanged = prevProduct.current !== selectedProduct;

    if (productChanged) {
      const wasMaxed = prevSales.current === prevProduction.current;

      setWasMaxedOnChange(wasMaxed);
    } else {
      setWasMaxedOnChange(false);
    }

    prevProduct.current = selectedProduct;
    prevProduction.current = productionAmount;
    prevSales.current = salesAmount;
  }, [selectedProduct, productionAmount, salesAmount]);

  return wasMaxedOnChange;
}
