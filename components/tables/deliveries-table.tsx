import { Translator } from "@/lib/types";
import CopyButton from "../copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useOverflowDetection } from "@/lib/hooks/useOverflowDetection";
import { cn } from "@/lib/utils";
import { DeliveryListItem } from "@/lib/calculations/calculateDailyWarehouseSupply";

type DeliveriesTableProps = {
  deliveryList: DeliveryListItem[];
  t: Translator;
};

const DeliveriesTable = ({ deliveryList, t }: DeliveriesTableProps) => {
  const { overflowRef, isOverflowing } = useOverflowDetection();

  return (
    <div ref={overflowRef} className={cn("mx-auto w-full max-w-lg space-y-2")}>
      <div
        className={cn("rounded-md border", isOverflowing && "overflow-x-auto")}
      >
        <Table className={cn("", !isOverflowing && "overflow-x-auto")}>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">
                {t(`tableColumns.deliverUpTo`)}
              </TableHead>
              <TableHead>{t(`tableColumns.itemName`)}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deliveryList
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeliveriesTable;
