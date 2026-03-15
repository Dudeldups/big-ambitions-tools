import { products } from "@/lib/game/products";
import { DataTable } from "../../../../components/tables/data-table";
import { productsColumns } from "./table-columns";

export default function DemoPage() {
  const data = Object.entries(products).map(([itemName, product]) => ({
    itemName,
    ...product,
  }));

  return (
    <div className="mx-auto py-10">
      <DataTable columns={productsColumns} data={data} />
    </div>
  );
}
