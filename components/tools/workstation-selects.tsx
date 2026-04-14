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
import { ProductName } from "@/lib/game/productNames";
import { Product, products } from "@/lib/game/products";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import {
  Control,
  Controller,
  UseFieldArrayAppend,
  UseFormSetValue,
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

type WorkstationSelectsProps = {
  control: Control<FactoryFormValues>;
  index: number;
  append: UseFieldArrayAppend<FactoryFormValues, "workstations">;
  remove: (index: number) => void;
  setValue: UseFormSetValue<FactoryFormValues>;
  factoryWorkerSalary: number;
  openingHours: number;
  productData: (Product & { name: string })[];
};

const WorkstationSelects = ({
  control,
  index,
  append,
  remove,
  setValue,
  factoryWorkerSalary,
  openingHours,
  productData,
}: WorkstationSelectsProps) => {
  const t = useTranslations();

  const selectedWorkstation = useWatch({
    control,
    name: `workstations.${index}.name`,
  });
  const selectedProduct = useWatch({
    control,
    name: `workstations.${index}.product`,
  });
  const workstationAmount = useWatch({
    control,
    name: `workstations.${index}.amount`,
  });
  const salesAmount = useWatch({
    control,
    name: `workstations.${index}.salesAmount`,
  });

  const productionAmount =
    products[selectedProduct].productionRate *
    workstationAmount *
    openingHours *
    7;

  const prevWorkstation = useRef(selectedWorkstation);

  useEffect(() => {
    if (prevWorkstation.current === selectedWorkstation) return;
    prevWorkstation.current = selectedWorkstation;

    const firstProduct = productData.find(
      (p) => p.workstation === selectedWorkstation,
    )?.name as ProductName;
    if (firstProduct) {
      setValue(`workstations.${index}.product`, firstProduct, {
        shouldValidate: true,
      });
    }
  }, [selectedWorkstation, index, setValue, productData]);

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
                  const value =
                    e.target.value === "" ? 1 : Number(e.target.value);
                  field.onChange(
                    Math.min(MAX_WORKSTATION_AMOUNT, Math.max(1, value)),
                  );
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
              <Select value={field.value} onValueChange={field.onChange}>
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

      <FieldGroup className="flex-row @max-sm:flex-col @sm:items-end">
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
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value === ""
                        ? undefined
                        : Number(value) > productionAmount
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

        <PriceIndexPopover
          selectedProduct={selectedProduct}
          factoryWorkerSalary={factoryWorkerSalary}
          className="ml-auto"
        />
      </FieldGroup>
    </div>
  );
};

export default WorkstationSelects;
