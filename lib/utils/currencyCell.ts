import { CellContext } from "@tanstack/react-table";

export function currencyCell<TData, TValue>() {
  return (ctx: CellContext<TData, TValue>) => {
    const value = ctx.getValue() as unknown as number;
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
}
