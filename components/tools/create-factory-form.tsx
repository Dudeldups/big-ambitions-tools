"use client";

import WorkstationSelects from "@/components/tools/workstation-selects";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
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
import { safeLog } from "@/lib/utils/safeLog";
import CancelConfirmModal from "../cancel-confirm-modal";
import WorkstationPresetDialog from "./workstation-preset-dialog";
import FormEmployees from "./form-employees";
import FormInformation from "./form-information";

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

  const sortedProductData = productData.sort((a, b) =>
    t(`products.${a.name}`).localeCompare(t(`products.${b.name}`)),
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = form;

  const {
    fields: workstationFields,
    append: appendWs,
    remove: removeWs,
  } = useFieldArray({
    control,
    name: "workstations",
  });
  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  const openingHours = useWatch({ control, name: "openingHours" });
  const factoryWorkerSalary = useWatch({
    control,
    name: "employees.factoryWorker.salary",
  });

  const onError = (errors: FieldErrors) => {
    safeLog("Form state:", form.getValues());
    safeLog("Form errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="@container/form space-y-10"
    >
      <FormInformation form={form} openingHours={openingHours} t={t} />

      <FormEmployees register={register} t={t} />

      {/* Vehicles */}

      <FieldSet className="@container/field-set px-4">
        <FieldLegend>Vehicles</FieldLegend>

        <FieldGroup className="gap-3 @md:flex-row @md:*:flex-1">
          {vehicleFields.map((field, index) => (
            <VehicleSelect
              key={field.id}
              control={control}
              index={index}
              onRemove={() => removeVehicle(index)}
            />
          ))}

          {vehicleFields.length < 2 && (
            <Button
              type="button"
              variant="secondary"
              className="px-0"
              onClick={() => appendVehicle({ name: "FreightTruckT1" })}
            >
              Add vehicle
            </Button>
          )}
        </FieldGroup>
      </FieldSet>

      {/* Workstations */}

      <FieldSet className="px-4">
        <FieldLegend>Workstations</FieldLegend>

        <FieldGroup>
          {workstationFields.map((field, index) => (
            <WorkstationSelects
              key={field.id}
              control={control}
              index={index}
              append={appendWs}
              remove={removeWs}
              setValue={setValue}
              factoryWorkerSalary={factoryWorkerSalary}
              openingHours={openingHours}
              productData={sortedProductData}
            />
          ))}

          {errors.workstations?.message && (
            <FieldError>{t(errors.workstations.message as never)}</FieldError>
          )}

          <Field orientation="horizontal" className="flex-wrap *:flex-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                appendWs({
                  amount: 1,
                  name: WORKSTATION_NAMES[0],
                  product: sortedProductData.find(
                    (p) => p.workstation === WORKSTATION_NAMES[0],
                  )!.name as ProductName,
                })
              }
            >
              Add workstation
            </Button>

            <WorkstationPresetDialog append={appendWs} />
          </Field>
        </FieldGroup>
      </FieldSet>

      {/* Actions */}

      <div className="bg-card mx-4 rounded-md">
        <div className="flex w-full max-w-xl flex-wrap gap-4 p-4 *:flex-1">
          <Button type="submit">{t("general.confirm")}</Button>
          <CancelConfirmModal
            buttonText={t("general.cancel")}
            modalText={t("modals.discardChanges")}
            onModalSubmit={onCancel}
          />
          <CancelConfirmModal
            buttonText={t("general.reset")}
            modalText={t("modals.resetForm")}
            onModalSubmit={reset}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateFactoryForm;
