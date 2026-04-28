import { Control, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import VehicleSelect from "./vehicle-select";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";

type FormVehicleProps = {
  control: Control<FactoryFormValues>;
  t: Translator;
};

const FormVehicles = ({ control, t }: FormVehicleProps) => {
  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  return (
    <FieldSet className="@container/field-set">
      <FieldLegend className="underline">
        {t("database.table.vehicles.title")}
      </FieldLegend>

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
  );
};

export default FormVehicles;
