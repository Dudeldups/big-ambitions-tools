import DatabaseDetailModal from "@/components/database/database-detail-modal";
import DatabaseItemDetail from "@/components/database/database-item-detail";
import { isIngredientName } from "@/lib/game/ingredientNames";
import { notFound } from "next/navigation";

export { generateMetadata } from "../../../ingredients/[ingredientName]/page";

export default async function IngredientDetailModal({
  params,
}: {
  params: Promise<{ ingredientName: string }>;
}) {
  const { ingredientName } = await params;
  if (!isIngredientName(ingredientName)) notFound();

  return (
    <DatabaseDetailModal kind="ingredient" itemName={ingredientName}>
      <DatabaseItemDetail kind="ingredient" name={ingredientName} inDialog />
    </DatabaseDetailModal>
  );
}
