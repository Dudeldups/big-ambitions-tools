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
import { products } from "@/lib/game/products";
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
import { FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { MAX_WORKSTATION_AMOUNT } from "@/lib/constants";

type WorkstationSelectsProps = {
  control: Control<FactoryFormValues>;
  index: number;
  append: UseFieldArrayAppend<FactoryFormValues, "workstations">;
  remove: (index: number) => void;
  setValue: UseFormSetValue<FactoryFormValues>;
};

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const WorkstationSelects = ({
  control,
  index,
  append,
  remove,
  setValue,
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
  }, [selectedWorkstation, index, setValue]);

  return (
    <div className="flex items-center gap-4 rounded-md border p-3">
      <Controller
        control={control}
        name={`workstations.${index}.amount`}
        render={({ field }) => (
          <div className="flex flex-col gap-2 self-end">
            <FieldLabel htmlFor={`workstationAmount-${index}`}>
              {t("general.amount")}
            </FieldLabel>
            <div className="flex items-center gap-3">
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
          </div>
        )}
      />

      <div className="flex flex-1 flex-col gap-2">
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
                        {t(`products.${p.name}`)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
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
    </div>
  );
};

export default WorkstationSelects;
