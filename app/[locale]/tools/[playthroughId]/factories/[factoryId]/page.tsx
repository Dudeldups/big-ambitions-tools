"use client";

import ImporterTable from "@/components/tables/importer-table";
import { Link } from "@/i18n/navigation";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useTranslations } from "next-intl";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deriveProductData } from "@/lib/calculations/derivedFactoryData";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import InfoTable from "@/components/tables/info-table";
import DeleteFactoryDialog from "@/components/tools/delete-factory-dialog";

const FactoryIdPage = () => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const { activeFactory } = useActiveFactory();
  const priceIndices = usePriceIndices();

  // TODO add skeletons
  if (!activeFactory || !activePlaythrough || !priceIndices) return null;

  const workstationAmount = activeFactory.workstations.reduce(
    (sum, ws) => sum + ws.amount,
    0,
  );

  const calculationPeriod = "weekly";

  const shoppingListData = getShoppingList(
    activeFactory,
    activePlaythrough.difficulty,
  );

  const sortedProductData = deriveProductData(
    activeFactory,
    activePlaythrough.difficulty,
    calculationPeriod,
    priceIndices,
  ).sort((a, b) => (a.valueType ?? "").localeCompare(b.valueType ?? ""));

  return (
    <div className="max-w-page mx-auto grid xl:grid-cols-2">
      <div className="overflow-x-auto px-4 py-8">
        <div className="flex justify-between max-md:flex-col">
          <div>
            <h2>{activeFactory.name}</h2>
            {activeFactory.description && <p>{activeFactory.description}</p>}

            <dl>
              <dt>Opening hours</dt>
              <dd>{activeFactory.openingHours}</dd>

              <dt>Delivery period</dt>
              <dd>{activeFactory.deliveryPeriod}</dd>

              <dt>Workstation amount</dt>
              <dd>{workstationAmount}</dd>
            </dl>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link
                href={`/tools/${activePlaythrough.id}/factories/${activeFactory.id}/edit`}
              >
                <Edit className="size-5" />
                Edit factory
              </Link>
            </Button>

            <DeleteFactoryDialog
              factoryToDelete={activeFactory.id}
              playthroughId={activePlaythrough.id}
            />
          </div>
        </div>

        <div className="mt-8">
          <hgroup className="space-y-4">
            <h2 className="text-xl font-semibold">Shopping list</h2>
            <p>This is what your factory needs to run at full capacity.</p>
          </hgroup>

          <div className="mt-14 flex w-full flex-col gap-4 space-y-6">
            {shoppingListData.map((group) => (
              <ImporterTable key={group.importer} data={group} t={t} />
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-4 py-8">
        <div className="space-y-4">
          <h2 className="text-center font-semibold capitalize">
            {calculationPeriod} revenue
          </h2>
          <InfoTable label="itemName" rows={sortedProductData} />
        </div>
      </div>
    </div>
  );
};

export default FactoryIdPage;
