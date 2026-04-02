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

type InfoTableProps = {
  label: string;
  rows: DerivedDataFromFormValues;
};

const InfoTable = ({ label, rows }: InfoTableProps) => {
  const t = useTranslations();

  const total = rows.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">
              {t(`tableColumns.amount`)}
            </TableHead>
            <TableHead>{t(`tableColumns.${label}`)}</TableHead>
            <TableHead className="text-right">
              {t(`tableColumns.purchasePrice`)}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, i) => {
            const showDivider =
              row.valueType && row.valueType !== rows[i - 1]?.valueType;

            return (
              <Fragment key={"f-" + row.name + i}>
                {showDivider && (
                  <TableRow key={`divider-${row.valueType}`}>
                    <TableCell colSpan={3}>
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
                  <TableCell>{t(row.name)}</TableCell>
                  <TableCell className="amount">
                    {formatToUSD(row.value)}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-semibold">
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
