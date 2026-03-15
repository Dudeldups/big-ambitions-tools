import { formatToUSD } from "./formatToUSD";
import { CellContext } from "@tanstack/react-table";
import { getMeta } from "./getMeta";
import { Price } from "../game/types";

export function currencyCell<TData, TValue>() {
  return (ctx: CellContext<TData, TValue>) => {
    const { difficulty } = getMeta(ctx.table);
    const rawValue = ctx.getValue();

    let value: number;

    if (typeof rawValue === "number") {
      value = rawValue;
    } else {
      const price = rawValue as Price;
      value = price[difficulty];
    }

    return formatToUSD(value);
  };
}
