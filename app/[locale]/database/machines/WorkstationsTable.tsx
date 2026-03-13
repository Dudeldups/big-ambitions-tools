import { useTranslations } from "next-intl";
import { Fragment } from "react";
import DatabaseTable from "../_components/DatabaseTable";
import DatabaseTableBody from "../_components/DatabaseTableBody";
import DatabaseTableHead from "../_components/DatabaseTableHead";
import { machines, Workstation, workstations } from "@/lib/game/machines";
import { useSortableData } from "@/lib/hooks/useSortableData";
import { getWorkstationPrice } from "@/lib/utils/getWorkstationPrice";
import { getWorkstationProducts } from "@/lib/utils/getWorkstationProducts";

const WorkstationsTable = () => {
  const t = useTranslations("database.table.workstations");
  const tGeneral = useTranslations("general");
  const tWorkstations = useTranslations("workstations");
  const tMachines = useTranslations("machines");
  const tProducts = useTranslations("products");
  const workstationEntries = Object.entries(workstations);
  const workstationHeaders = [
    "workstation",
    "purchasePrice",
    ...(Object.keys(
      workstationEntries[0][1],
    ) as (keyof (typeof workstationEntries)[0][1])[]),
  ];

  const accessors = {
    workstation: ([name]: [string, Workstation]) => name,

    purchasePrice: ([, w]: [string, Workstation]) => getWorkstationPrice(w),

    neededMachines: ([, w]: [string, Workstation]) => w.neededMachines.length,
  };

  const {
    sortedData: sortedWorkstations,
    sortConfig,
    requestSort,
  } = useSortableData(workstationEntries, accessors, "workstation");

  return (
    <>
      <DatabaseTable tableType="workstations">
        <DatabaseTableHead>
          {workstationHeaders.map((key) => {
            const headerKey = `headers.${key}`;
            return (
              <th key={`col-${key}`} scope="col">
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
          {sortedWorkstations.map(([itemName, workstation]) => (
            <Fragment key={`rows-${itemName}`}>
              <tr>
                <th scope="row" rowSpan={2} className="text-left">
                  {tWorkstations(itemName)}
                </th>
                <td className="amount">
                  <ul>
                    {workstation.neededMachines.map((machine) => (
                      <li key={`price-${machine}`}>
                        {machines[machine].purchasePrice}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {workstation.neededMachines.map((machine) => (
                      <li key={`machine-name-${machine}`}>
                        {tMachines(machine)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="amount">{getWorkstationPrice(workstation)}</td>
                <td>{tGeneral("summedUpAmount")}</td>
              </tr>
            </Fragment>
          ))}
        </DatabaseTableBody>
      </DatabaseTable>
    </>
  );
};

export default WorkstationsTable;
