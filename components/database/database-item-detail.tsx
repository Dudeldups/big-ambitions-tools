"use client";

import CurrencyText from "@/components/currency-text";
import { DialogTitle } from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAverageRetailPrice,
  getExportPrice,
  getImportPrice,
  getManufacturePrice,
  getWorkstationPrice,
} from "@/lib/calculations/math";
import { getProductIngredientGroups } from "@/lib/utils/getProductIngredientGroups";
import { IngredientName } from "@/lib/game/ingredientNames";
import { ProductName } from "@/lib/game/productNames";
import { getGameData } from "@/lib/game/registry";
import { useAppState } from "@/lib/hooks/useAppState";
import { initialAppState } from "@/lib/stores/appStore";
import { ProductIngredientEntry } from "@/lib/utils/getProductIngredientGroups";
import { MachineName, WorkstationName } from "@/lib/game/machineNames";
import { getWorkstationProducts } from "@/lib/utils/getWorkstationProducts";
import { Factory } from "lucide-react";
import { DATABASE_DETAIL_CONFIG, DetailKind } from "./database-detail-config";

const DatabaseItemDetail = ({
  kind,
  name,
  inDialog = false,
}: {
  kind: DetailKind;
  name: ProductName | IngredientName | WorkstationName;
  inDialog?: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const selectedDifficulty = useAppState((state) => state.difficulty);
  const selectedGameVersion = useAppState((state) => state.gameVersion);
  const selectedTablePriceIndex = useAppState((state) => state.tablePriceIndex);
  // Direct pages render the default data on the server, then adopt saved settings.
  const difficulty =
    selectedDifficulty ?? (inDialog ? null : initialAppState.difficulty);
  const gameVersion =
    selectedGameVersion ?? (inDialog ? null : initialAppState.gameVersion);
  const tablePriceIndex =
    selectedTablePriceIndex ??
    (inDialog ? null : initialAppState.tablePriceIndex);
  const gameData = gameVersion ? getGameData(gameVersion) : undefined;
  const itemName = t(`${DATABASE_DETAIL_CONFIG[kind].namespace}.${name}`);
  const product =
    kind === "product" && gameData
      ? gameData.products[name as ProductName]
      : undefined;
  const ingredient =
    kind === "ingredient" && gameData
      ? gameData.ingredients[name as IngredientName]
      : undefined;
  const workstation =
    kind === "workstation" && gameData
      ? gameData.workstations[name as WorkstationName]
      : undefined;

  const heading = inDialog ? (
    <DialogTitle
      data-database-detail-title
      tabIndex={-1}
      className="font-heading min-w-0 text-2xl leading-tight font-semibold break-words outline-none sm:text-3xl"
    >
      {itemName}
    </DialogTitle>
  ) : (
    <h1
      id="database-item-detail-title"
      data-database-detail-title
      tabIndex={-1}
      className="font-heading min-w-0 text-2xl leading-tight font-semibold break-words outline-none sm:text-3xl"
    >
      {itemName}
    </h1>
  );

  if (
    !gameVersion ||
    !gameData ||
    difficulty == null ||
    tablePriceIndex == null
  ) {
    return (
      <article
        aria-busy="true"
        className={inDialog ? "space-y-6 p-5 sm:p-7" : "space-y-6"}
      >
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:pr-10">
          <Skeleton className="size-16 shrink-0" />
          {heading}
        </header>
        <Skeleton className="h-24 w-full" />
      </article>
    );
  }

  if (!product && !ingredient && !workstation) {
    return (
      <article className={inDialog ? "space-y-6 p-5 sm:p-7" : "space-y-6"}>
        <header className="flex items-start gap-4 pr-10">{heading}</header>
        <p role="status" className="text-muted-foreground">
          {t("database.details.unavailable", { version: gameVersion })}
        </p>
      </article>
    );
  }

  const image =
    kind === "workstation" ? (
      <Factory
        aria-hidden="true"
        className="text-muted-foreground size-16 shrink-0"
      />
    ) : (
      <Image
        src={`/assets/gameImages/${name}.png`}
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        className="size-16 shrink-0 object-contain"
        priority
      />
    );

  if (workstation) {
    const products = getWorkstationProducts(
      name as WorkstationName,
      gameData.products,
    ).sort(([nameA], [nameB]) =>
      t(`products.${nameA}`).localeCompare(t(`products.${nameB}`), locale),
    );
    const allMachinesAvailable = workstation.neededMachines.every(
      (machineName) => gameData.machines[machineName] !== undefined,
    );

    return (
      <article className={inDialog ? "space-y-6 p-5 sm:p-7" : "space-y-6"}>
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:pr-10">
          {image}
          {heading}
        </header>

        <dl className="divide-y">
          <DetailField label={t("tableColumns.purchasePrice")}>
            {allMachinesAvailable ? (
              <CurrencyText
                value={getWorkstationPrice(workstation, gameData)}
              />
            ) : (
              "-"
            )}
          </DetailField>
          <DetailField label={t("tableColumns.neededMachines")}>
            <ul className="space-y-3">
              {workstation.neededMachines.map((machineName, index) => (
                <li
                  key={`${machineName}-${index}`}
                  className="flex items-start gap-2"
                >
                  <ItemThumbnail name={machineName} />
                  <div className="min-w-0 break-words">
                    <p>{t(`machines.${machineName}`)}</p>
                    {gameData.machines[machineName] ? (
                      <CurrencyText
                        value={gameData.machines[machineName].purchasePrice}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t("database.details.unavailable", {
                          version: gameVersion,
                        })}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </DetailField>
        </dl>

        <section
          aria-labelledby="workstation-products-heading"
          className="space-y-3"
        >
          <h2
            id="workstation-products-heading"
            className="font-heading text-lg font-semibold"
          >
            {t("general.products")}
          </h2>
          {products.length > 0 ? (
            <ul className="divide-y">
              {products.map(([productName, workstationProduct]) => (
                <li key={productName} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/database/products/${productName}`}
                    replace={inDialog}
                    scroll={false}
                    className="focus-visible:ring-ring flex w-fit max-w-full items-center gap-2 rounded-sm font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <ItemThumbnail name={productName} />
                    <span className="min-w-0 break-words">
                      {t(`products.${productName}`)}
                    </span>
                  </Link>
                  <p className="text-muted-foreground mt-1 ml-10 text-sm">
                    {t("tableColumns.productionRate")}:{" "}
                    {workstationProduct.productionRate}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              {t("database.details.noWorkstationProducts")}
            </p>
          )}
        </section>
      </article>
    );
  }

  if (product) {
    const ingredientGroups = getProductIngredientGroups(product).filter(
      (group) => group.length > 0,
    );
    const importPrice = getImportPrice(
      product.wholesalePrice,
      difficulty,
      tablePriceIndex,
    );
    const manufacturePrice = getManufacturePrice(product, difficulty, gameData);
    const retailPrice = getAverageRetailPrice(product);
    const exportPrice = getExportPrice(
      product.wholesalePrice,
      difficulty,
      tablePriceIndex,
    );

    return (
      <article className={inDialog ? "space-y-6 p-5 sm:p-7" : "space-y-6"}>
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:pr-10">
          {image}
          {heading}
        </header>

        <dl className="divide-y">
          <DetailField label={t("tableColumns.amountPerBox")}>
            {product.amountPerBox}
          </DetailField>
          <DetailField label={t("tableColumns.importPrice")}>
            <CurrencyText value={importPrice} />
          </DetailField>
          <DetailField label={t("tableColumns.manufacturePrice")}>
            <CurrencyText value={manufacturePrice} />
          </DetailField>
          <DetailField label={t("tableColumns.retailPrice")}>
            <CurrencyText value={retailPrice} />
          </DetailField>
          <DetailField label={t("tableColumns.exportPrice")}>
            <CurrencyText value={exportPrice} />
          </DetailField>
          <DetailField label={t("tableColumns.productionRate")}>
            {product.productionRate}
          </DetailField>
          <DetailField label={t("tableColumns.workstation")}>
            <Link
              href={`/database/workstations/${product.workstation}`}
              replace={inDialog}
              scroll={false}
              className="focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
            >
              {t(`workstations.${product.workstation}`)}
            </Link>
          </DetailField>
          <DetailField label={t("tableColumns.importers")}>
            {product.importers.length > 0 ? (
              <ul className="space-y-1">
                {product.importers.map((importer) => (
                  <li key={importer}>{t(`importers.${importer}`)}</li>
                ))}
              </ul>
            ) : (
              "-"
            )}
          </DetailField>
        </dl>

        <section
          aria-labelledby="product-ingredients-heading"
          className="space-y-3"
        >
          <h2
            id="product-ingredients-heading"
            className="font-heading text-lg font-semibold"
          >
            {t("general.ingredients")}
          </h2>
          {ingredientGroups.length > 0 ? (
            <ul className="divide-y">
              {ingredientGroups.map((group, groupIndex) => (
                <li key={groupIndex} className="py-3 first:pt-0 last:pb-0">
                  {group.length > 1 && (
                    <p className="text-muted-foreground mb-2 text-sm">
                      {t("database.details.oneOf")}:
                    </p>
                  )}
                  <ul className="space-y-2">
                    {group.map((entry) => (
                      <li key={entry.name}>
                        <Link
                          href={`/database/ingredients/${entry.name}`}
                          replace={inDialog}
                          scroll={false}
                          className="focus-visible:ring-ring flex w-fit max-w-full items-center gap-2 rounded-sm font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <ItemThumbnail name={entry.name} />
                          <span className="shrink-0 whitespace-nowrap">
                            {entry.amount} ×
                          </span>{" "}
                          <span className="min-w-0 break-words">
                            {t(`ingredients.${entry.name}`)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              {t("database.details.noIngredients")}
            </p>
          )}
        </section>
      </article>
    );
  }

  const importPrice = getImportPrice(ingredient!.wholesalePrice, difficulty);
  const productUsages = Object.entries(gameData.products)
    .flatMap(([productName, productData]) => {
      if (!productData) return [];
      const matchingGroups = getProductIngredientGroups(productData).filter(
        (group) => group.some((entry) => entry.name === name),
      );
      return matchingGroups.length > 0
        ? [
            {
              productName: productName as ProductName,
              groups: matchingGroups,
            },
          ]
        : [];
    })
    .sort((a, b) =>
      t(`products.${a.productName}`).localeCompare(
        t(`products.${b.productName}`),
        locale,
      ),
    );

  return (
    <article className={inDialog ? "space-y-6 p-5 sm:p-7" : "space-y-6"}>
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:pr-10">
        {image}
        {heading}
      </header>

      <dl className="divide-y">
        <DetailField label={t("tableColumns.amountPerBox")}>
          {ingredient!.amountPerBox}
        </DetailField>
        <DetailField label={t("tableColumns.importPrice")}>
          <CurrencyText value={importPrice} />
        </DetailField>
        <DetailField label={t("tableColumns.importers")}>
          {ingredient!.importers.length > 0 ? (
            <ul className="space-y-1">
              {ingredient!.importers.map((importer) => (
                <li key={importer}>{t(`importers.${importer}`)}</li>
              ))}
            </ul>
          ) : (
            "-"
          )}
        </DetailField>
      </dl>

      <section
        aria-labelledby="ingredient-products-heading"
        className="space-y-3"
      >
        <h2
          id="ingredient-products-heading"
          className="font-heading text-lg font-semibold"
        >
          {t("database.details.usedInProducts")}
        </h2>
        {productUsages.length > 0 ? (
          <ul className="divide-y">
            {productUsages.map(({ productName, groups }) => (
              <li key={productName} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/database/products/${productName}`}
                  replace={inDialog}
                  scroll={false}
                  className="focus-visible:ring-ring flex w-fit max-w-full items-center gap-2 rounded-sm font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <ItemThumbnail name={productName} />
                  <span className="min-w-0 break-words">
                    {t(`products.${productName}`)}
                  </span>
                </Link>
                <ul className="text-muted-foreground mt-1 ml-10 space-y-1 text-sm">
                  {groups.map((group, groupIndex) => (
                    <li key={groupIndex}>
                      {formatUsageAmount(group, name as IngredientName)}
                      {group.length > 1 && (
                        <span>
                          {" "}
                          ({t("database.details.oneOf")}:{" "}
                          {group
                            .map((entry) => t(`ingredients.${entry.name}`))
                            .join(" / ")}
                          )
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {t("database.details.noProducts")}
          </p>
        )}
      </section>
    </article>
  );
};

const ItemThumbnail = ({
  name,
}: {
  name: ProductName | IngredientName | MachineName;
}) => (
  <Image
    src={`/assets/gameImages/${name}.png`}
    alt=""
    aria-hidden="true"
    width={32}
    height={32}
    className="size-8 shrink-0 object-contain"
  />
);

const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="py-3 first:pt-0 last:pb-0">
    <dt className="text-muted-foreground text-sm">{label}</dt>
    <dd className="mt-1 font-medium [&_.amount]:whitespace-nowrap">
      {children}
    </dd>
  </div>
);

const formatUsageAmount = (
  group: ProductIngredientEntry[],
  ingredientName: IngredientName,
) => {
  const entry = group.find((item) => item.name === ingredientName);
  return entry ? `${entry.amount} ×` : "";
};

export default DatabaseItemDetail;
