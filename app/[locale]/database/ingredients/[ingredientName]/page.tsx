import DatabaseItemDetail from "@/components/database/database-item-detail";
import DatabaseDetailPage from "@/components/database/database-detail-page";
import { isIngredientName } from "@/lib/game/ingredientNames";
import { generateDatabaseDetailMetadata } from "@/lib/generateDatabaseDetailMetadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type IngredientDetailRouteProps = {
  params: Promise<{ locale: string; ingredientName: string }>;
};

export async function generateMetadata({
  params,
}: IngredientDetailRouteProps): Promise<Metadata> {
  const { locale, ingredientName } = await params;
  if (!isIngredientName(ingredientName)) return {};

  return generateDatabaseDetailMetadata({
    locale,
    kind: "ingredient",
    name: ingredientName,
  });
}

export default async function IngredientDetailPage({
  params,
}: IngredientDetailRouteProps) {
  const { ingredientName } = await params;
  if (!isIngredientName(ingredientName)) notFound();

  return (
    <DatabaseDetailPage kind="ingredient">
      <DatabaseItemDetail kind="ingredient" name={ingredientName} />
    </DatabaseDetailPage>
  );
}
