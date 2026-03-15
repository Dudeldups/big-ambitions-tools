"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { machinesColumns } from "./machines-table-columns";
import { machines, workstations } from "@/lib/game/machines";
import { workstationsColumns } from "./workstations-table-columns";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatToUSD } from "@/lib/utils/formatToUSD";

export default function MachinesPage() {
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

  return (
    <>
      <DataTable
        columns={machinesColumns}
        data={machinesData}
        className="max-w-xl"
      />
      <DataTable
        columns={workstationsColumns}
        data={workstationsData}
        className="mt-14"
        renderRow={(row, t) => {
          const rowMachines = row.original.neededMachines;
          const prices = rowMachines.map((m) => machines[m]?.purchasePrice);
          const total = prices.reduce((acc, price) => acc + (price || 0), 0);

          return (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell rowSpan={2} className="align-top">
                  {t(`workstations.${row.original.itemName}`)}
                </TableCell>

                <TableCell>
                  <ul>
                    {rowMachines.map((m, i) => (
                      <li key={i}>{t(`machines.${m}`)}</li>
                    ))}
                  </ul>
                </TableCell>

                <TableCell className="text-right">
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
                <TableCell className="text-right font-semibold">
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
