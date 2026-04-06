"use client";

import WorkstationSelects from "@/components/tools/workstation-selects";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { ProductName } from "@/lib/game/productNames";
import { products } from "@/lib/game/products";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useTranslations } from "next-intl";
import {
  FieldErrors,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import VehicleSelect from "./vehicle-select";
import EmployeeSalaryField from "./employee-salary-field";
import { EmployeeName } from "@/lib/game/employeeNames";
import { RadioButtonGroup } from "../radio-button-group";
import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";
import DeliveryPeriodSelect from "./delivery-period-select";
import { safeLog } from "@/lib/utils/safeLog";
import CancelConfirmModal from "../cancel-confirm-modal";

type CreateFactoryFormProps = {
  form: UseFormReturn<FactoryFormValues>;
  onSubmit: (data: FactoryFormValues) => void;
  onCancel: () => void;
};

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const CreateFactoryForm = ({
  form,
  onSubmit,
  onCancel,
}: CreateFactoryFormProps) => {
  const t = useTranslations();
  const calculationPeriod = useAppState((s) => s.calculationPeriod);
  const setCalculationPeriod = useAppStore((s) => s.setCalculationPeriod);

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
  const factoryWorkerSalary = useWatch({
    control,
    name: "employees.factoryWorker.salary",
  });

  const onError = (errors: FieldErrors) => {
    safeLog("Form errors:", errors);
  };

  const factoryEmployees = [
    "deliveryDriver",
    "hrManager",
    "logisticsManager",
    "purchasingAgent",
    "factoryWorker",
  ] as const satisfies readonly EmployeeName[];

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-10">
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
              <FieldError>{t(errors.name.message as never)}</FieldError>
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
              <FieldError>{t(errors.description.message as never)}</FieldError>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup className="flex-row">
          <Field className="flex-1">
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

          <div className="flex-1 space-y-4">
            <p>Calculation basis</p>
            <RadioButtonGroup
              name="calculationPeriod"
              value={calculationPeriod}
              onChange={setCalculationPeriod}
              options={[
                {
                  value: "hourly",
                  label: t("general.calculationPeriodOptions.hourly"),
                },
                {
                  value: "daily",
                  label: t("general.calculationPeriodOptions.daily"),
                },
                {
                  value: "weekly",
                  label: t("general.calculationPeriodOptions.weekly"),
                },
              ]}
            />

            <p>Delivery period</p>
            <DeliveryPeriodSelect control={control} />
          </div>
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
          <VehicleSelect control={control} index={0} />
          <VehicleSelect control={control} index={1} />
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
              factoryWorkerSalary={factoryWorkerSalary}
            />
          ))}

          {errors.workstations?.message && (
            <FieldError>{t(errors.workstations.message as never)}</FieldError>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                amount: 1,
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
        <CancelConfirmModal onModalSubmit={onCancel} />
        <Button type="submit">{t("general.confirm")}</Button>
      </div>
    </form>
  );
};

export default CreateFactoryForm;
