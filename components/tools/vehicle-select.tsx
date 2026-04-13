import { Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Vehicle, vehicles } from "@/lib/game/vehicles";
import { useTranslations } from "next-intl";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { NONE_VALUE } from "@/lib/constants";
import { VehicleName } from "@/lib/game/vehicleNames";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

type VehicleSelectProps = {
  control: Control<FactoryFormValues>;
  index: number;
  onRemove: () => void;
};

const VehicleSelect = ({ control, index, onRemove }: VehicleSelectProps) => {
  const t = useTranslations();
  const deliveryVehicles = (
    Object.entries(vehicles) as [VehicleName, Vehicle][]
  )
    .map(([vName, vData]) => ({
      ...vData,
      name: vName,
    }))
    .filter((v) => v.destinationsThatCanDeliver >= 1)
    .sort(
      (a, b) =>
        b.destinationsThatCanDeliver - a.destinationsThatCanDeliver ||
        a.purchasePrice - b.purchasePrice,
    );

  return (
    <Controller
      control={control}
      name={`vehicles.${index}`}
      render={({ field }) => (
        <div className="flex">
          <Select
            key={field.value.name ?? "none"}
            value={field.value.name}
            onValueChange={(val) => {
              if (val === NONE_VALUE) {
                onRemove();
              } else {
                field.onChange({ name: val });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("general.vehicle")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("general.vehicle")}</SelectLabel>

                {deliveryVehicles.map((v) => (
                  <SelectItem key={v.name} value={v.name}>
                    {t(`vehicles.${v.name}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {index > 0 && (
            <Button
              type="button"
              aria-label={t("general.delete")}
              onClick={onRemove}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="size-5" />
            </Button>
          )}
        </div>
      )}
    />
  );
};

export default VehicleSelect;
