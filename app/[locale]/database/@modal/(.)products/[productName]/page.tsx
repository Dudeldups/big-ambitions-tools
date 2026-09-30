import DatabaseDetailModal from "@/components/database/database-detail-modal";
import DatabaseItemDetail from "@/components/database/database-item-detail";
import { isProductName } from "@/lib/game/productNames";
import { notFound } from "next/navigation";

export { generateMetadata } from "../../../products/[productName]/page";

export default async function ProductDetailModal({
  params,
}: {
  params: Promise<{ productName: string }>;
}) {
  const { productName } = await params;
  if (!isProductName(productName)) notFound();

  return (
    <DatabaseDetailModal kind="product" itemName={productName}>
      <DatabaseItemDetail kind="product" name={productName} inDialog />
    </DatabaseDetailModal>
  );
}
