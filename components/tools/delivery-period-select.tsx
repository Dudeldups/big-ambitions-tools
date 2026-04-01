import { Control, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import { cn } from "@/lib/utils";
import { FactoryFormValues } from "@/lib/schemas/factory";

type DeliveryPeriodSelectProps = {
  className?: string;
  control: Control<FactoryFormValues>;
};

const DeliveryPeriodSelect = ({
  className,
  control,
}: DeliveryPeriodSelectProps) => {
  return (
    <Controller
      control={control}
      name="deliveryPeriod"
      render={({ field }) => (
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          className={cn("w-fit", className)}
        >
          <Field orientation="horizontal">
            <RadioGroupItem value="daily" id="order-pref-daily" />
            <FieldContent>
              <FieldLabel htmlFor="order-pref-daily" className="cursor-pointer">
                Daily
              </FieldLabel>
              <FieldDescription>
                Calculate pallet shelves based on daily delivery from a central
                warehouse.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="weekly" id="order-pref-weekly" />
            <FieldContent>
              <FieldLabel
                htmlFor="order-pref-weekly"
                className="cursor-pointer"
              >
                Weekly
              </FieldLabel>
              <FieldDescription>
                Order all ingredients to this factory once a week.
              </FieldDescription>
            </FieldContent>
          </Field>
        </RadioGroup>
      )}
    />
  );
};

export default DeliveryPeriodSelect;
