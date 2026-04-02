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
import { vehicles } from "@/lib/game/vehicles";
import { useTranslations } from "next-intl";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { NONE_VALUE } from "@/lib/constants";

type VehicleSelectProps = {
  control: Control<FactoryFormValues>;
  index: number;
};

const VehicleSelect = ({ control, index }: VehicleSelectProps) => {
  const t = useTranslations();
  const deliveryVehicles = Object.entries(vehicles)
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
      name={`vehicles.${index}` as `vehicles.0` | `vehicles.1`}
      render={({ field }) => (
        <Select
          key={field.value ?? "none"}
          value={field.value ?? NONE_VALUE}
          onValueChange={(val) =>
            field.onChange(val === NONE_VALUE ? undefined : val)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("general.vehicle")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("general.vehicle")}</SelectLabel>

              {index > 0 && (
                <SelectItem value={NONE_VALUE}>
                  {t("general.noValue")}
                </SelectItem>
              )}

              {deliveryVehicles.map((v) => (
                <SelectItem key={v.name} value={v.name}>
                  {t(`vehicles.${v.name}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default VehicleSelect;
