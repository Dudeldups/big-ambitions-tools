import { ingredients } from "@/lib/game/ingredients";
import { DataTable } from "../../../../components/tables/data-table";
import { ingredientsColumns } from "./table-columns";

export default function IngredientsPage() {
  const data = Object.entries(ingredients).map(([itemName, ingredient]) => ({
    itemName,
    ...ingredient,
  }));

  return (
    <div className="mx-auto py-10">
      <DataTable columns={ingredientsColumns} data={data} />
    </div>
  );
}
