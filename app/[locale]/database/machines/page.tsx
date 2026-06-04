"use client";

import { DataTable } from "../../../../components/tables/data-table";
import { machinesColumns } from "./machines-table-columns";
import { workstationsColumns } from "./workstations-table-columns";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import { useTranslations } from "next-intl";
import { WorkstationName } from "@/lib/game/machineNames";
import DefaultHgroup from "@/components/deco/default-hgroup";
import { cn } from "@/lib/utils";
import SectionSeparator from "@/components/deco/section-separator";
import { useAppState } from "@/lib/hooks/useAppState";
import { getGameData } from "@/lib/game/registry";
import { DataTableSkeleton } from "@/components/cemetery/data-table-skeleton";

export default function MachinesPage() {
  const t = useTranslations();
  const gameVersion = useAppState((state) => state.gameVersion);
  const machines = gameVersion ? getGameData(gameVersion).machines : undefined;
  const workstations = gameVersion
    ? getGameData(gameVersion).workstations
    : undefined;

  const machinesData = !machines
    ? []
    : Object.entries(machines).flatMap(([itemName, machine]) =>
        machine ? [{ itemName, ...machine }] : [],
      );

  const workstationsData = !workstations
    ? []
    : Object.entries(workstations).flatMap(([itemName, workstation]) =>
        workstation ? [{ itemName, ...workstation }] : [],
      );

  return (
    <>
      <DefaultHgroup
        title={t("general.machines")}
        caption={t("database.machines.caption")}
      />

      {gameVersion && machines && workstations ? (
        <>
          <DataTable
            columns={machinesColumns(t)}
            data={machinesData}
            className="max-w-max"
          />

          <SectionSeparator />

          <DefaultHgroup title={t("general.workstations")} />

          <DataTable
            columns={workstationsColumns(t, machines)}
            data={workstationsData}
            className="mt-14 max-w-max"
            renderRow={(row) => {
              const { neededMachines: rowMachines, itemName } = row.original;
              const prices = rowMachines.map(
                (machineName) => machines[machineName]?.purchasePrice ?? 0,
              );
              const total = prices.reduce<number>(
                (acc, price) => acc + price,
                0,
              );

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
      ) : (
        <>
          <DataTableSkeleton
            className="max-w-max"
            columnCount={2}
            rowCount={8}
          />
          <SectionSeparator />
          <DefaultHgroup title={t("general.workstations")} />
          <DataTableSkeleton
            className="mt-14 max-w-max"
            columnCount={3}
            rowCount={6}
          />
        </>
      )}
    </>
  );
}
