import { DataTable } from "../../../../components/tables/data-table";
import { machinesColumns } from "./machines-table-columns";
import { machines, workstations } from "@/lib/game/machines";
import { workstationsColumns } from "./workstations-table-columns";

export default function MachinesPage() {
  const machinesData = Object.entries(machines).map(([itemName, machine]) => ({
    itemName,
    ...machine,
  }));

  const workstationsData = Object.entries(workstations).map(
    ([itemName, workstation]) => ({
      itemName,
      neededMachines: workstation.neededMachines,
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
      />
    </>
  );
}
