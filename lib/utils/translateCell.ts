import { CellContext } from "@tanstack/react-table";
import { getMeta } from "./getMeta";

export function translateCell<TData, TValue>(prefix: string) {
  return (ctx: CellContext<TData, TValue>) => {
    const { t } = getMeta(ctx.table);
    const value = ctx.getValue() as string;

    return t(`${prefix}.${value}`);
  };
}
