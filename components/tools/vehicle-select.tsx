import { Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { vehicles } from "@/lib/game/vehicles";
import { useTranslations } from "next-intl";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { NONE_VALUE } from "@/lib/constants";

type VehicleSelectProps = {
  control: Control<FactoryFormValues>;
  index: 1 | 2;
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
      name={`vehicle${index}`}
      render={({ field }) => (
        <Select
          key={field.value}
          value={field.value}
          onValueChange={(val) =>
            field.onChange(val === NONE_VALUE ? undefined : val)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("general.vehicle")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {index === 2 && (
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
