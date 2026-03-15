import { DataTable } from "../../../../components/tables/data-table";
import { shelves } from "@/lib/game/inventory";
import { inventoryColumns } from "./table-columns";

export default function DemoPage() {
  const data = Object.entries(shelves).map(([itemName, shelf]) => ({
    itemName,
    ...shelf,
  }));

  return (
    <div className="mx-auto py-10">
      <DataTable columns={inventoryColumns} data={data} />
    </div>
  );
}
