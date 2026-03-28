import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

type InfoTableRow = {
  label: string;
  value: string;
};

type InfoTableProps = {
  headers: [string, string];
  rows: InfoTableRow[];
  total?: string;
};

const InfoTable = ({ headers, rows, total }: InfoTableProps) => {
  const t = useTranslations();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(`general.tableColumns.${headers[0]}`)}</TableHead>
            <TableHead className="text-right">
              {t(`general.tableColumns.${headers[1]}`)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={row.label + i}>
              <TableCell>{row.label}</TableCell>
              <TableCell className="amount">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {total && (
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold">
                {t("general.summedUpAmount")}
              </TableCell>
              <TableCell className="amount">{total}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
};

export default InfoTable;
