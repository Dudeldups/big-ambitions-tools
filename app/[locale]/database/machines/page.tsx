"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { machinesColumns } from "./machines-table-columns";
import { machines, workstations } from "@/lib/game/machines";
import { workstationsColumns } from "./workstations-table-columns";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { useTranslations } from "next-intl";
import { WorkstationName } from "@/lib/game/machineNames";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { cn } from "@/lib/utils";
import SectionSeparator from "@/components/deco/section-separator";

const machinesData = Object.entries(machines).map(([itemName, machine]) => ({
  itemName,
  ...machine,
}));

const workstationsData = Object.entries(workstations).map(
  ([itemName, workstation]) => ({
    itemName,
    ...workstation,
  }),
);

export default function MachinesPage() {
  const t = useTranslations();

  return (
    <>
      <DefaultHgroup
        title={t("general.machines")}
        caption={t("database.machines.caption")}
      />

      <DataTable
        columns={machinesColumns(t)}
        data={machinesData}
        className="max-w-max"
      />

      <SectionSeparator />

      <DefaultHgroup title={t("general.workstations")} />

      <DataTable
        columns={workstationsColumns(t)}
        data={workstationsData}
        className="mt-14 max-w-max"
        renderRow={(row) => {
          const { neededMachines: rowMachines, itemName } = row.original;
          const prices = rowMachines.map((m) => machines[m]?.purchasePrice);
          const total = prices.reduce((acc, price) => acc + (price || 0), 0);

          const bgClass =
            "nth-[4n+1]:bg-card nth-[4n+2]:bg-card nth-[4n+3]:bg-background nth-[4n+4]:bg-background";

          return (
            <React.Fragment key={row.id}>
              <TableRow
                className={cn(
                  bgClass,
                  "peer/row1 hover:bg-muted peer-hover/row2:bg-muted",
                )}
              >
                <TableCell rowSpan={2} className="align-top">
                  {t(`workstations.${itemName as WorkstationName}`)}
                </TableCell>

                <TableCell>
                  <ul>
                    {rowMachines.map((m, i) => (
                      <li key={i}>{t(`machines.${m}`)}</li>
                    ))}
                  </ul>
                </TableCell>

                <TableCell className="amount">
                  <ul>
                    {prices.map((p, i) => (
                      <li key={i}>{formatToUSD(p)}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>

              <TableRow
                className={cn(
                  bgClass,
                  "peer/row2 hover:bg-muted peer-hover/row1:bg-muted",
                )}
              >
                <TableCell className="font-semibold">
                  {t("general.summedUpAmount")}
                </TableCell>
                <TableCell className="amount underline underline-offset-2">
                  {formatToUSD(total)}
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        }}
      />
    </>
  );
}
