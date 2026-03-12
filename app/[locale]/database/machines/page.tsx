"use client";

import { Machine, machines } from "@/lib/game/machines";
import { useTranslations } from "next-intl";
import Searchbar from "../_components/Searchbar";
import DatabaseTable from "../_components/DatabaseTable";
import { useSortableData } from "@/lib/hooks/useSortableData";
import DatabaseTableHead from "../_components/DatabaseTableHead";
import DatabaseTableBody from "../_components/DatabaseTableBody";

const Machines = () => {
  const t = useTranslations("database.table.machines");
  const tMachines = useTranslations("machines");
  const machineEntries = Object.entries(machines);
  const machineHeaders = [
    "itemName",
    ...(Object.keys(
      machineEntries[0][1],
    ) as (keyof (typeof machineEntries)[0][1])[]),
  ];
  const accessors = {
    purchasePrice: ([, p]: [string, Machine]) => p.purchasePrice,
  };

  const {
    sortedData: sortedMachines,
    sortConfig,
    requestSort,
  } = useSortableData(machineEntries, accessors, "itemName");

  return (
    <>
      <h2>{t("title")}</h2>

      <Searchbar />

      <DatabaseTable tableType="machines">
        <DatabaseTableHead>
          {machineHeaders.map((key) => {
            const headerKey = `headers.${key}`;
            return (
              <th key={key} scope="col">
                <button
                  className="flex w-full items-center gap-2 text-left"
                  onClick={() => requestSort(key)}
                >
                  {t(headerKey)}
                  {sortConfig.field === key && (
                    <span aria-hidden="true">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              </th>
            );
          })}
        </DatabaseTableHead>

        <DatabaseTableBody>
          {sortedMachines.map(([itemName, machine]) => (
            <tr key={itemName}>
              <th scope="row" className="text-left">
                {tMachines(itemName)}
              </th>
              <td className="amount">{machine.purchasePrice}</td>
            </tr>
          ))}
        </DatabaseTableBody>
      </DatabaseTable>
    </>
  );
};

export default Machines;
