"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { Product } from "@/lib/game/types";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Control,
  Controller,
  UseFieldArrayAppend,
  UseFormGetValues,
  UseFormSetValue,
  UseFormUnregister,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { MAX_WORKSTATION_AMOUNT } from "@/lib/constants";
import { Separator } from "../ui/separator";
import PriceIndexPopover from "../price-index-popover";
import Image from "next/image";
import { useMaxSalesAmount } from "@/lib/hooks/useMaxSalesAmount";
import { useSyncProductWithWorkstation } from "@/lib/hooks/useSyncProductWithWorkstation";
import { Checkbox } from "../ui/checkbox";
import { ProductName } from "@/lib/game/productNames";
import { requireProduct } from "@/lib/game/requireGameData";
import { getEffectiveProductionByProduct } from "@/lib/calculations/getEffectiveProductionByProduct";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { GameData } from "@/lib/game/types";

type WorkstationSelectsProps = {
  control: Control<FactoryFormValues>;
  index: number;
  append: UseFieldArrayAppend<FactoryFormValues, "workstations">;
  remove: (index: number) => void;
  setValue: UseFormSetValue<FactoryFormValues>;
  getValues: UseFormGetValues<FactoryFormValues>;
  unregister: UseFormUnregister<FactoryFormValues>;
  factoryWorkerSalary: number;
  openingHours: number;
  productData: (Product & { name: string })[];
  gameData: GameData;
};

const WorkstationSelects = ({
  control,
  index,
  append,
  remove,
  setValue,
  getValues,
  unregister,
  factoryWorkerSalary,
  openingHours,
  productData,
  gameData,
}: WorkstationSelectsProps) => {
  const t = useTranslations();

  const allWorkstations = useWatch({
    control,
    name: "workstations",
  });

  const [selectedWorkstation, selectedProduct, workstationAmount, salesAmount] =
    useWatch({
      control,
      name: [
        `workstations.${index}.name`,
        `workstations.${index}.product`,
        `workstations.${index}.amount`,
        `workstations.${index}.salesAmount`,
      ],
    });

  const selectedProductData = requireProduct(gameData, selectedProduct);
  const productionAmount =
    selectedProductData.productionRate * workstationAmount * openingHours * 7;
  const productionDataByProduct = getEffectiveProductionByProduct(
    allWorkstations,
    openingHours,
    gameData,
  );
  const selectedProductProductionData =
    productionDataByProduct[selectedProduct];
  const weeklyProductionAmount =
    selectedProductProductionData?.fullWeeklyAmount ??
    selectedProductData.productionRate * workstationAmount * openingHours * 7;
  const selectedProductLimit = allWorkstations.find(
    (workstation) =>
      workstation.product === selectedProduct &&
      workstation.productionLimit !== undefined,
  )?.productionLimit;
  const isProductionLimited = selectedProductLimit !== undefined;

  const setProductionLimitForProduct = (
    productName: ProductName,
    value: number | undefined,
  ) => {
    const currentWorkstations = getValues("workstations");
    const affectedIndexes = currentWorkstations.flatMap(
      (workstation, wsIndex) =>
        workstation.product === productName ? [wsIndex] : [],
    );

    if (value !== undefined) {
      affectedIndexes.forEach((wsIndex) => {
        setValue(`workstations.${wsIndex}.productionLimit`, value, {
          shouldValidate: true,
        });
      });
      return;
    }

    const updatedWorkstations = currentWorkstations.map((workstation) => {
      if (workstation.product !== productName) return workstation;

      if (value === undefined) {
        const { productionLimit: _productionLimit, ...rest } = workstation;
        return rest;
      }

      return {
        ...workstation,
        productionLimit: value,
      };
    });

    setValue("workstations", updatedWorkstations, {
      shouldValidate: true,
    });

    affectedIndexes.forEach((wsIndex) => {
      unregister(`workstations.${wsIndex}.productionLimit`);
    });
  };

  const setProductForWorkstation = (productName: ProductName) => {
    const currentWorkstations = getValues("workstations");
    const existingLimit = currentWorkstations.find(
      (workstation, wsIndex) =>
        wsIndex !== index &&
        workstation.product === productName &&
        workstation.productionLimit !== undefined,
    )?.productionLimit;

    const updatedWorkstations = currentWorkstations.map(
      (workstation, wsIndex) => {
        if (wsIndex !== index) return workstation;

        if (existingLimit === undefined) {
          const { productionLimit: _productionLimit, ...rest } = workstation;
          return {
            ...rest,
            product: productName,
          };
        }

        return {
          ...workstation,
          product: productName,
          productionLimit: existingLimit,
        };
      },
    );

    setValue("workstations", updatedWorkstations, {
      shouldValidate: true,
    });

    if (existingLimit === undefined) {
      unregister(`workstations.${index}.productionLimit`);
    }
  };

  useSyncProductWithWorkstation({
    selectedWorkstation,
    productData,
    onProductChange: setProductForWorkstation,
  });

  useMaxSalesAmount({
    selectedProduct,
    productionAmount,
    salesAmount,
    onPreserve: () =>
      setValue(`workstations.${index}.salesAmount`, productionAmount, {
        shouldValidate: true,
      }),
  });

  return (
    <div className="@container/workstations space-y-4 rounded-md border p-3">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 @md:@max-2xl:flex">
        <Controller
          control={control}
          name={`workstations.${index}.amount`}
          render={({ field }) => (
            <div className="order-1 flex gap-2 self-end @md:@max-2xl:flex-col">
              <FieldLabel htmlFor={`workstationAmount-${index}`}>
                {t("general.amount")}
              </FieldLabel>
              <Input
                className="max-w-20"
                id={`workstationAmount-${index}`}
                type="number"
                value={field.value}
                max={MAX_WORKSTATION_AMOUNT}
                onChange={(e) => {
                  let value = e.target.value.replace(/^0+/, "");
                  if (value === "") value = "0";
                  e.target.value = value;
                  field.onChange(
                    Math.min(MAX_WORKSTATION_AMOUNT, Number(value)),
                  );
                }}
                onFocus={(e) => {
                  if (field.value === 0) e.target.select();
                }}
                onBlur={field.onBlur}
                min={1}
              />
            </div>
          )}
        />

        <div className="order-2 flex gap-2 @md:@max-2xl:order-3 @md:@max-2xl:flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("general.copy")}
            onClick={() => {
              if (!selectedWorkstation || !selectedProduct) {
                toast.error(t("toasts.workstationCopyError"), {
                  position: "bottom-right",
                });
              } else {
                append({
                  amount: 1,
                  name: selectedWorkstation,
                  product: selectedProduct,
                  productionLimit: selectedProductLimit,
                });
              }
            }}
          >
            <Copy className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("general.delete")}
            onClick={() => remove(index)}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>

        <div className="order-3 col-span-2 flex flex-1 flex-col gap-2 @md:@max-2xl:order-2 @2xl:flex-row">
          <Controller
            control={control}
            name={`workstations.${index}.name`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Workstation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("general.workstation")}</SelectLabel>
                    {WORKSTATION_NAMES.map((ws) => (
                      <SelectItem key={ws} value={ws}>
                        {t(`workstations.${ws}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name={`workstations.${index}.product`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) =>
                  setProductForWorkstation(value as ProductName)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("general.product")}</SelectLabel>
                    {productData
                      .filter((p) => p.workstation === selectedWorkstation)
                      .map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          <Image
                            src={`/assets/gameImages/${p.name}.png`}
                            alt={p.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                          {t(`products.${p.name}` as never)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Separator />

      <FieldGroup className="flex-row @max-lg:flex-col @lg:items-end">
        <Controller
          control={control}
          name={`workstations.${index}.salesAmount`}
          render={({ field }) => (
            <Field orientation="horizontal" className="w-fit flex-wrap">
              <FieldLabel htmlFor={`workstationSalesAmount-${index}`}>
                {t("tools.factoryPlanner.estimatedSales")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  className="max-w-24"
                  id={`workstationSalesAmount-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={salesAmount ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value === "") {
                      const updatedWorkstations = getValues("workstations").map(
                        (workstation, wsIndex) => {
                          if (wsIndex !== index) return workstation;

                          // Remove the optional field entirely so edit forms
                          // don't snap back to the previous default value.
                          const { salesAmount: _salesAmount, ...rest } =
                            workstation;
                          return rest;
                        },
                      );

                      setValue("workstations", updatedWorkstations, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      return;
                    }

                    field.onChange(
                      Number(value) > productionAmount
                        ? productionAmount
                        : Number(value),
                    );
                  }}
                  onBlur={field.onBlur}
                  max={productionAmount}
                />
                <span>/ {productionAmount}</span>
              </div>
            </Field>
          )}
        />

        <Field orientation="horizontal" className="w-fit flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`workstationProductionLimitToggle-${index}`}
                  checked={isProductionLimited}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setProductionLimitForProduct(selectedProduct, undefined);
                      return;
                    }

                    setProductionLimitForProduct(
                      selectedProduct,
                      weeklyProductionAmount,
                    );
                  }}
                  aria-label={t(
                    "tools.factoryPlanner.workstations.useProductionLimit",
                  )}
                />
                <FieldLabel
                  htmlFor={`workstationProductionLimitToggle-${index}`}
                >
                  {t("tools.factoryPlanner.workstations.productionLimit")}
                </FieldLabel>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {t("tools.factoryPlanner.workstations.productionLimitTooltip")}
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            <Input
              className="max-w-24"
              id={`workstationProductionLimit-${index}`}
              type="number"
              placeholder="0"
              value={
                selectedProductLimit === 0 ? "" : (selectedProductLimit ?? "")
              }
              disabled={!isProductionLimited}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setProductionLimitForProduct(selectedProduct, 0);
                  return;
                }

                setProductionLimitForProduct(
                  selectedProduct,
                  Math.min(weeklyProductionAmount, Number(value)),
                );
              }}
              min={1}
              max={weeklyProductionAmount}
            />
            <span>/ {weeklyProductionAmount}</span>
          </div>
        </Field>

        {selectedProductData.productSalesRatio > 0 && (
          <PriceIndexPopover
            selectedProduct={selectedProduct}
            factoryWorkerSalary={factoryWorkerSalary}
            className="ml-auto"
          />
        )}
      </FieldGroup>
    </div>
  );
};

export default WorkstationSelects;
