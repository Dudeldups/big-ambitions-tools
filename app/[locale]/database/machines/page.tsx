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
      <DataTable
        columns={machinesColumns(t)}
        data={machinesData}
        className="max-w-4xl"
      />

      <DataTable
        columns={workstationsColumns(t)}
        data={workstationsData}
        className="mt-14 max-w-4xl"
        renderRow={(row) => {
          const { neededMachines: rowMachines, itemName } = row.original;
          const prices = rowMachines.map((m) => machines[m]?.purchasePrice);
          const total = prices.reduce((acc, price) => acc + (price || 0), 0);

          return (
            <React.Fragment key={row.id}>
              <TableRow>
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

              <TableRow>
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
