import { Translator } from "@/lib/types";
import CopyButton from "../copy-button";
import { ImporterShoppingList } from "@/lib/utils/getShoppingList";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useOverflowDetection } from "@/lib/hooks/useOverflowDetection";
import { cn } from "@/lib/utils";

type ImporterTableProps = {
  data: ImporterShoppingList;
  t: Translator;
};

const ImporterTable = ({ data, t }: ImporterTableProps) => {
  const { importer, items } = data;

  const total = items.reduce((sum, item) => sum + item.value, 0);

  const { overflowRef, isOverflowing } = useOverflowDetection();

  return (
    <div ref={overflowRef} className={cn("mx-auto w-full max-w-2xl space-y-2")}>
      <span className="mb-4 block text-lg font-semibold">
        {t(`importers.${importer}`)}
      </span>

      <div
        className={cn("rounded-md border", isOverflowing && "overflow-x-auto")}
      >
        <Table className={cn("", !isOverflowing && "overflow-x-auto")}>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">
                {t(`tableColumns.amount`)}
              </TableHead>
              <TableHead>{t(`tableColumns.itemName`)}</TableHead>
              <TableHead className="text-right">
                {t(`tableColumns.purchasePrice`)}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items
              .sort((a, b) =>
                t(`ingredients.${a.name}`).localeCompare(
                  t(`ingredients.${b.name}`),
                ),
              )
              .map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="flex items-center justify-end gap-2">
                    <span className="amount">{item.amount}</span>

                    <CopyButton value={item.amount} />
                  </TableCell>

                  <TableCell>{t(`ingredients.${item.name}`)}</TableCell>

                  <TableCell className="amount">
                    {formatToUSD(item.value)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-semibold">
                {t("general.summedUpAmount")}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatToUSD(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ImporterTable;
