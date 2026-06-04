import { Control, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import VehicleSelect from "./vehicle-select";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { Vehicle } from "@/lib/game/types";
import { VehicleName } from "@/lib/game/vehicleNames";

type FormVehicleProps = {
  control: Control<FactoryFormValues>;
  t: Translator;
};

const FormVehicles = ({ control, t }: FormVehicleProps) => {
  const { activePlaythrough } = useActivePlaythrough();
  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  if (!activePlaythrough) return null;

  const gameData = getPlaythroughGameData(activePlaythrough);
  const deliveryVehicles = (
    Object.entries(gameData.vehicles) as [VehicleName, Vehicle | undefined][]
  )
    .flatMap(([name, vehicle]) => (vehicle ? [{ ...vehicle, name }] : []))
    .filter((vehicle) => vehicle.destinationsThatCanDeliver >= 1)
    .sort(
      (a, b) =>
        b.destinationsThatCanDeliver - a.destinationsThatCanDeliver ||
        a.purchasePrice - b.purchasePrice,
    );

  return (
    <FieldSet className="@container/field-set">
      <FieldLegend className="mb-3 underline">
        {t("general.vehicles")}
      </FieldLegend>

      <FieldGroup className="gap-3 @md:flex-row @md:*:flex-1">
        {vehicleFields.map((field, index) => (
          <VehicleSelect
            key={field.id}
            control={control}
            index={index}
            onRemove={() => removeVehicle(index)}
            deliveryVehicles={deliveryVehicles}
          />
        ))}

        {vehicleFields.length < 2 && (
          <Button
            type="button"
            variant="secondary"
            className="px-0"
            onClick={() => appendVehicle({ name: "FreightTruckT1" })}
          >
            {t("tools.factoryPlanner.vehicles.addBtn")}
          </Button>
        )}
      </FieldGroup>
    </FieldSet>
  );
};

export default FormVehicles;
