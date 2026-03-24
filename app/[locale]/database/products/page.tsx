"use client";

import { products } from "@/lib/game/products";
import { DataTable } from "../../../../components/tables/data-table";
import { productsColumns } from "./table-columns";
import { useAppState } from "@/lib/hooks/useAppState";

const data = Object.entries(products).map(([itemName, product]) => ({
  itemName,
  ...product,
}));

export default function ProductsPage() {
  const difficulty = useAppState((state) => state.difficulty);

  return (
    <div className="mx-auto py-10">
      <DataTable columns={productsColumns(difficulty)} data={data} />
    </div>
  );
}
