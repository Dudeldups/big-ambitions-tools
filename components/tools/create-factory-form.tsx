"use client";

import WorkstationSelects from "@/components/tools/workstation-selects";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { ProductName } from "@/lib/game/productNames";
import { products } from "@/lib/game/products";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import VehicleSelect from "./vehicle-select";
import EmployeeSalaryField from "./employee-salary-field";
import { EmployeeName } from "@/lib/game/employeeNames";

type CreateFactoryFormProps = {
  form: UseFormReturn<FactoryFormValues>;
};

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const CreateFactoryForm = ({ form }: CreateFactoryFormProps) => {
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
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workstations",
  });

  const openingHours = useWatch({ control, name: "openingHours" });

  const onSubmit = (values: FactoryFormValues) => {
    console.log(values);
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

  const factoryEmployees = [
    "deliveryDriver",
    "logisticsManager",
    "factoryWorker",
    "purchasingAgent",
  ] as const satisfies readonly EmployeeName[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Factory Information */}
      <FieldSet className="px-4">
        <FieldLegend>Factory Information</FieldLegend>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Factory Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              maxLength={50}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-destructive text-sm">
                {t(errors.name.message)}
              </p>
            )}
          </Field>

          <Field className="-mt-2">
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              {...register("description")}
              maxLength={150}
            />
            {errors.description?.message && (
              <p className="text-destructive text-sm">
                {t(errors.description.message)}
              </p>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="openingHours">Opening hours / day</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                className="max-w-20"
                id="openingHours"
                type="number"
                min={1}
                max={24}
                step={1}
                {...register("openingHours", { valueAsNumber: true })}
              />
              <span className="text-muted-foreground">
                {openingHours * 7}h / week
              </span>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>

      {/* Employees */}
      <FieldSet className="px-4">
        <FieldLegend>Employees</FieldLegend>
        <FieldDescription className="text-muted-foreground">
          Enter the salary for each employee.
        </FieldDescription>

        <FieldGroup className="space-y-6 px-4">
          {factoryEmployees.map((employee) => (
            <EmployeeSalaryField
              key={employee}
              employeeName={employee}
              register={register}
              t={t}
            />
          ))}
        </FieldGroup>
      </FieldSet>

      {/* Vehicles */}
      <FieldSet className="px-4">
        <FieldLegend>Vehicles</FieldLegend>

        <FieldGroup>
          <VehicleSelect control={control} index={1} />
          <VehicleSelect control={control} index={2} />
        </FieldGroup>
      </FieldSet>

      {/* Workstations */}
      <FieldSet className="px-4">
        <FieldLegend>Workstations</FieldLegend>

        <FieldGroup>
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
        </FieldGroup>
      </FieldSet>

      {/* Actions */}
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

export default CreateFactoryForm;
