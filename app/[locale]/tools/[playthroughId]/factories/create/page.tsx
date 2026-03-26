"use client";

import WorkstationSelects from "@/components/tools/workstation-selects";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { ProductName } from "@/lib/game/productNames";
import { products } from "@/lib/game/products";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const FactoryCreatePage = () => {
  const t = useTranslations();
  const createFactory = usePlaythroughStore((state) => state.createFactory);
  const addFactoryToPlaythrough = usePlaythroughStore(
    (state) => state.addFactoryToPlaythrough,
  );
  const router = useRouter();
  const { activePlaythrough } = useActivePlaythrough();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: { workstations: [], openingHours: 24 },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workstations",
  });

  const onSubmit = (values: FactoryFormValues) => {
    const hasMissingName = values.name.trim() === "";
    if (hasMissingName) {
      values.name = t("tools.factoryPlanner.genericFactoryName", {
        productName: t(`products.${values.workstations[0].product}`),
      });
    }

    const newFactory = createFactory(values);
    addFactoryToPlaythrough(activePlaythrough.id, newFactory.id);
    toast.success(
      `Factory "${newFactory.name}" created and added to playthrough!`,
    );
    startTransition(() => {
      router.push(`/tools/${activePlaythrough.id}/factories`);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup className="px-4">
        <Field>
          <Label htmlFor="name" {...register("name")}>
            Factory Name
          </Label>
          <Input
            id="name"
            {...(register("name"), { maxLength: 50, autoComplete: "off" })}
          />
          {errors.name?.message && (
            <p className="text-destructive text-sm">{t(errors.name.message)}</p>
          )}
        </Field>
        <Field>
          <Label htmlFor="description" {...register("description")}>
            Description
          </Label>
          <Textarea id="description" {...register("description")} />
          {errors.description?.message && (
            <p className="text-destructive text-sm">
              {t(errors.description.message)}
            </p>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="px-4">
        <Field>
          <FieldDescription className="text-foreground">
            Workstations
          </FieldDescription>

          {fields.map((field, index) => (
            <WorkstationSelects
              key={field.id}
              control={control}
              index={index}
              append={append}
              remove={remove}
              setValue={setValue}
            />
          ))}

          {errors.workstations?.message && (
            <p className="text-destructive text-sm">
              {t(errors.workstations.message)}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: WORKSTATION_NAMES[0],
                product: productData.find(
                  (p) => p.workstation === WORKSTATION_NAMES[0],
                )!.name as ProductName,
              })
            }
          >
            Add Workstation
          </Button>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="openingHours"
          control={control}
          render={({ field }) => (
            <>
              <div className="flex justify-between">
                <Label id="slider-label" htmlFor="openingHours">
                  Opening hours / day
                </Label>
                <span>{field.value}h</span>
              </div>
              <Slider
                aria-labelledby="slider-label"
                id="openingHours"
                value={[field.value]}
                onValueChange={field.onChange}
                min={1}
                max={24}
                step={1}
              />
            </>
          )}
        />
      </FieldGroup>

      <div className="bg-card flex gap-4 rounded-md p-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          {t("general.reset")}
        </Button>
        <Button variant="outline">{t("general.cancel")}</Button>
        <Button type="submit" disabled={isPending}>
          {t("general.confirm")}
        </Button>
      </div>
    </form>
  );
};

export default FactoryCreatePage;
