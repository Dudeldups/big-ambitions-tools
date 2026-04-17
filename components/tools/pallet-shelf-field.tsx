import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { cn } from "@/lib/utils";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  control: Control<FactoryFormValues>;
  errors: FieldErrors<FactoryFormValues>;
};

export function PalletShelfField({ className, control, errors }: Props) {
  const t = useTranslations();
  const [shelfAmount, workstations] = useWatch({
    control,
    name: ["shelfAmount", "workstations"],
  });

  const { daily, weekly } = getOptimalPalletShelfAmount(workstations);

  const hasWeekly = shelfAmount >= weekly;
  const hasDaily = shelfAmount >= daily;

  return (
    <Controller
      control={control}
      name="shelfAmount"
      render={({ field }) => (
        <div className={cn("flex gap-8 *:flex-1 @max-2xl:flex-col", className)}>
          <Field>
            <FieldLabel htmlFor="shelf-amount">Pallet Shelves</FieldLabel>
            <FieldDescription>
              Define how many pallet shelves are available in this factory.
            </FieldDescription>

            <Input
              className="max-w-20"
              id="shelf-amount"
              type="number"
              placeholder="0"
              min={1}
              {...field}
              onChange={(e) => {
                let value = e.target.value.replace(/^0+/, "");
                if (value === "") value = "0";
                e.target.value = value;
                field.onChange(Number(value));
              }}
              onFocus={(e) => {
                if (field.value === 0) e.target.select();
              }}
            />
            {errors?.shelfAmount?.message && (
              <FieldError>{t(errors.shelfAmount.message)}</FieldError>
            )}
          </Field>

          <div className="mt-7 space-y-1">
            {weekly > 0 ? (
              <>
                <p>
                  Daily delivery requires <strong>{daily}</strong> shelves.
                </p>
                <p>
                  Weekly delivery requires <strong>{weekly}</strong> shelves.
                </p>

                {hasWeekly ? (
                  <p className="text-green-600">
                    ✓ Enough for weekly delivery.
                  </p>
                ) : hasDaily ? (
                  <p className="text-yellow-600">
                    ⚠ Enough for daily delivery only. A warehouse is required
                    for weekly logistics.
                  </p>
                ) : (
                  <p className="text-red-600">
                    ✕ Not enough storage even for daily delivery.
                  </p>
                )}
              </>
            ) : (
              <p>
                Add at least one workstation to see the required number of
                shelves.
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
}
