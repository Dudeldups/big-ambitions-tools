import { formatToUSD } from "./formatToUSD";
import { CellContext } from "@tanstack/react-table";
import { getMeta } from "./getMeta";
import { StoreDifficulty } from "../game/types";
import { Spinner } from "@/components/ui/spinner";

export function currencyCell<TData>(
  getValueFn: (row: TData, difficulty?: StoreDifficulty) => number | undefined,
) {
  return function CurrencyCell(ctx: CellContext<TData, unknown>) {
    const { difficulty } = getMeta(ctx.table);
    const row = ctx.row.original;

    const value = getValueFn(row, difficulty);

    if (!value === null || value === undefined) {
      return (
        <div className="flex h-4 justify-end">
          <Spinner />
        </div>
      );
    }

    return formatToUSD(value);
  };
}
