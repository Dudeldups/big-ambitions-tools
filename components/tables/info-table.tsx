import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DerivedDataFromFormValues } from "@/lib/calculations/derivedFactoryData";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { useTranslations } from "next-intl";
import { Fragment } from "react/jsx-runtime";
import CurrencyText from "../currency-text";
import { cn } from "@/lib/utils";
import { useOverflowDetection } from "@/lib/hooks/useOverflowDetection";

type InfoTableProps = {
  label: string;
  rows: DerivedDataFromFormValues;
};

const InfoTable = ({ label, rows }: InfoTableProps) => {
  const t = useTranslations();

  const total = rows.reduce((sum, item) => sum + item.value, 0);

  const hasDiff = rows.some((item) => !!item.diff);

  const { overflowRef, isOverflowing } = useOverflowDetection();

  return (
    <div
      ref={overflowRef}
      className={cn(
        "mx-auto w-full max-w-3xl rounded-md border",
        isOverflowing && "overflow-x-auto",
      )}
    >
      <Table className={cn("", !isOverflowing && "overflow-x-auto")}>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">
              {t(`tableColumns.amount`)}
            </TableHead>
            <TableHead>{t(`tableColumns.${label}`)}</TableHead>
            {hasDiff && (
              <TableHead className="text-right">
                {t(`general.netProfit`)}
              </TableHead>
            )}
            <TableHead className="text-right">
              {t(`tableColumns.purchasePrice`)}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows
            .sort(
              (a, b) =>
                (a.valueType ?? "").localeCompare(b.valueType ?? "") ||
                a.name.localeCompare(b.name),
            )
            .map((row, i) => {
              const showDivider =
                row.valueType && row.valueType !== rows[i - 1]?.valueType;

              return (
                <Fragment key={"f-" + row.name + i}>
                  {showDivider && (
                    <TableRow key={`divider-${row.valueType}`}>
                      <TableCell colSpan={row.diff ? 4 : 3}>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <div className="bg-border h-px flex-1" />
                          <span>{row.valueType?.toUpperCase()}</span>
                          <div className="bg-border h-px flex-1" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow key={row.name + i}>
                    <TableCell className="amount">{row.amount}</TableCell>
                    <TableCell className="truncate">{t(row.name)}</TableCell>
                    {row.diff && (
                      <TableCell className="amount">
                        <CurrencyText value={row.diff} />
                      </TableCell>
                    )}
                    <TableCell className={cn("amount")}>
                      <span>{formatToUSD(row.value)}</span>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={hasDiff ? 3 : 2} className="font-semibold">
              {t("general.summedUpAmount")}
            </TableCell>
            <TableCell className="amount">{formatToUSD(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default InfoTable;
