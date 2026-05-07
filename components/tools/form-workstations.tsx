import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import WorkstationPresetDialog from "./workstation-preset-dialog";
import WorkstationSelects from "./workstation-selects";
import { ProductName } from "@/lib/game/productNames";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Translator } from "@/lib/types";
import { products } from "@/lib/game/products";

type FormWorkstationProps = {
  form: UseFormReturn<FactoryFormValues>;
  t: Translator;
};

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const FormWorkstations = ({ form, t }: FormWorkstationProps) => {
  const {
    setValue,
    getValues,
    unregister,
    control,
    formState: { errors },
  } = form;

  const sortedProductData = productData.sort((a, b) =>
    t(`products.${a.name}`).localeCompare(t(`products.${b.name}`)),
  );

  const openingHours = useWatch({ control, name: "openingHours" });

  const factoryWorkerSalary = useWatch({
    control,
    name: "employees.factoryWorker.salary",
  });

  const {
    fields: workstationFields,
    append: appendWs,
    remove: removeWs,
  } = useFieldArray({
    control,
    name: "workstations",
  });

  return (
    <FieldSet>
      <FieldLegend className="mb-3 underline">
        {t("general.workstations")}
      </FieldLegend>

      <FieldGroup>
        {workstationFields.map((field, index) => (
          <WorkstationSelects
            key={field.id}
            control={control}
            index={index}
            append={appendWs}
            remove={removeWs}
            setValue={setValue}
            getValues={getValues}
            unregister={unregister}
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
            {t("tools.factoryPlanner.workstations.addBtn")}
          </Button>

          <WorkstationPresetDialog append={appendWs} />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
};

export default FormWorkstations;
