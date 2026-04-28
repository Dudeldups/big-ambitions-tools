"use client";

import ImporterTable from "@/components/tables/importer-table";
import { Link, useRouter } from "@/i18n/navigation";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useTranslations } from "next-intl";
import { Clock, Edit, Hammer, ShelvingUnit, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deriveEmployeeData,
  deriveImporterTotals,
  derivePalletShelfData,
  deriveProductData,
  deriveVehicleData,
  deriveWorkstationData,
} from "@/lib/calculations/derivedFactoryData";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import OverviewTableWrapper from "@/components/tools/overview-table-wrapper";
import OneTimeCostDialog from "@/components/tools/one-time-cost-dialog";
import { Separator } from "@/components/ui/separator";
import DeleteDialog from "@/components/delete-dialog";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { toast } from "sonner";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";
import SectionWrapper from "@/components/deco/section-wrapper";

const FactoryIdPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { activePlaythrough } = useActivePlaythrough();
  const { activeFactory } = useActiveFactory();
  const priceIndices = usePriceIndices();
  const deleteFactory = usePlaythroughStore((state) => state.deleteFactory);

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

  const recurringRowData = [
    ...deriveImporterTotals(shoppingListData),
    ...deriveEmployeeData(activeFactory, calculationPeriod),
  ];

  const sortedProductData = deriveProductData(
    activeFactory,
    activePlaythrough.difficulty,
    calculationPeriod,
    priceIndices,
  ).sort((a, b) => (a.valueType ?? "").localeCompare(b.valueType ?? ""));

  const oneTimeCostRowData = [
    ...derivePalletShelfData(activeFactory),
    ...deriveVehicleData(activeFactory),
    ...deriveWorkstationData(activeFactory),
  ];

  const requiredShelves = getOptimalPalletShelfAmount(
    activeFactory.workstations,
  ).weekly;

  const { factoryList, externalList } = splitShoppingListByShelves(
    shoppingListData,
    requiredShelves,
    activeFactory.shelfAmount,
  );

  const onDelete = () => {
    const deleted = deleteFactory(activeFactory.id, activePlaythrough.id);
    if (deleted) {
      toast.success(
        t("toasts.factoryDeleteSuccess", {
          factoryName: deleted.name,
        }),
        {
          position: "bottom-right",
        },
      );
    }

    router.push(`/tools/${activePlaythrough.id}/factories`);
  };

  return (
    <SectionWrapper size="noTopPadding" className="xl:grid xl:grid-cols-2">
      <div className="px-4 py-8">
        <div className="@container flex w-full flex-col gap-10">
          <div className="flex w-full justify-between gap-6 max-md:flex-col">
            <hgroup className="">
              <h2 className="text-h3 mb-4">{activeFactory.name}</h2>
              {activeFactory.description && (
                <p className="text-muted-foreground max-w-md">
                  {activeFactory.description}
                </p>
              )}
            </hgroup>

            <div className="flex gap-3 max-md:w-full max-md:flex-col max-md:*:w-full @max-2xl:self-end">
              {/* CRUD buttons */}
              <OneTimeCostDialog rows={oneTimeCostRowData} />

              <Button variant="outline" asChild>
                <Link
                  href={`/tools/${activePlaythrough.id}/factories/${activeFactory.id}/edit`}
                >
                  <Edit className="size-5" />
                  {t("tools.factoryDetail.editBtn")}
                </Link>
              </Button>

              <DeleteDialog
                onDelete={onDelete}
                title={t("tools.factoryForm.deleteTitle")}
                description={t("tools.factoryForm.deleteDesc")}
              />
            </div>
          </div>

          <ul className="grid gap-3 *:flex *:gap-2 @xl:flex">
            {/* Factory stats */}
            <li>
              <Clock className="size-6" />
              {activeFactory.openingHours}h
            </li>
            <li>
              <ShelvingUnit className="size-6" />
              {t("counts.palletShelf", { count: activeFactory.shelfAmount })}
            </li>
            <li>
              <Hammer className="size-6" />
              {workstationAmount} {t("general.workstations")}
            </li>
            <li>
              <Truck className="size-6" />
              {activeFactory.vehicles.length}{" "}
              {activeFactory.vehicles.length === 1
                ? t("general.vehicle")
                : t("general.vehicles")}
            </li>
          </ul>
        </div>

        <div className="mt-14">
          <hgroup className="max-w-2xl space-y-4">
            {/* Shopping list */}
            <h2 className="text-xl font-semibold">
              {t("tools.factoryDetail.shoppingList.title")}
            </h2>
            <p>{t("tools.factoryDetail.shoppingList.desc")}</p>
          </hgroup>

          <div className="mt-10 flex w-full flex-col gap-4 space-y-6">
            {shoppingListData.map((group) => (
              <ImporterTable key={group.importer} data={group} t={t} />
            ))}
          </div>
        </div>

        {externalList.length > 0 && (
          <div className="mt-14">
            <hgroup className="max-w-2xl space-y-4 pr-10">
              {/* Split shopping list */}
              <h2 className="text-xl font-semibold">
                {t("tools.factoryDetail.splitShoppingList.title")}
              </h2>
              <p>
                {t("tools.factoryDetail.splitShoppingList.desc", {
                  shelfAmount: activeFactory.shelfAmount,
                  requiredAmount: requiredShelves,
                })}
              </p>
              <p>{t("tools.factoryDetail.splitShoppingList.desc1")}</p>
            </hgroup>

            <div className="mt-10 flex w-full flex-col gap-4 space-y-6">
              {factoryList.map((group) => (
                <ImporterTable key={group.importer} data={group} t={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-10 overflow-x-auto px-4 py-8">
        <OverviewTableWrapper
          title="weekly revenue"
          label="itemName"
          rowData={sortedProductData}
        />

        {recurringRowData.length > 0 && (
          <>
            <Separator />

            <OverviewTableWrapper
              title="weekly expenses"
              label="description"
              rowData={recurringRowData}
            />
          </>
        )}
      </div>
    </SectionWrapper>
  );
};

export default FactoryIdPage;
