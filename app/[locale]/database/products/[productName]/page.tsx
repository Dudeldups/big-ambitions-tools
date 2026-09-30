import DatabaseItemDetail from "@/components/database/database-item-detail";
import DatabaseDetailPage from "@/components/database/database-detail-page";
import { isProductName } from "@/lib/game/productNames";
import { generateDatabaseDetailMetadata } from "@/lib/generateDatabaseDetailMetadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type ProductDetailRouteProps = {
  params: Promise<{ locale: string; productName: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailRouteProps): Promise<Metadata> {
  const { locale, productName } = await params;
  if (!isProductName(productName)) return {};

  return generateDatabaseDetailMetadata({
    locale,
    kind: "product",
    name: productName,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailRouteProps) {
  const { productName } = await params;
  if (!isProductName(productName)) notFound();

  return (
    <DatabaseDetailPage kind="product">
      <DatabaseItemDetail kind="product" name={productName} />
    </DatabaseDetailPage>
  );
}
