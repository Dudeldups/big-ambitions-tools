"use client";

import { products } from "@/lib/game/products";
import { DataTable } from "../../../../components/tables/data-table";
import { ProductsColumnData, productsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";
import { ProductName } from "@/lib/game/productNames";

const data: ProductsColumnData[] = (Object.keys(products) as ProductName[]).map(
  (itemName) => ({
    ...products[itemName],
    itemName,
  }),
);

export default function ProductsPage() {
  const difficulty = useAppState((state) => state.difficulty);

  return (
    <div className="mx-auto py-10">
      <DataTable columns={productsColumns(difficulty)} data={data} />
    </div>
  );
}
