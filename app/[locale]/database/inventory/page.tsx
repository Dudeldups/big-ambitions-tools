import { DataTable } from "../../../../components/tables/data-table";
import { shelves } from "@/lib/game/inventory";
import { columns } from "./table-columns";

export default function DemoPage() {
  const data = Object.entries(shelves).map(([itemName, shelf]) => ({
    itemName,
    ...shelf,
  }));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
