import { Control, Controller, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { cn } from "@/lib/utils";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";

type Props = {
  className?: string;
  control: Control<FactoryFormValues>;
};

export function PalletShelfField({ className, control }: Props) {
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
        <div className={cn("flex gap-4 *:flex-1 @max-sm:flex-col", className)}>
          <Field>
            <FieldLabel htmlFor="shelf-amount">Pallet Shelves</FieldLabel>
            <FieldDescription>
              Define how many pallet shelves are available in this factory.
            </FieldDescription>

            <Input
              className="max-w-20"
              id="shelf-amount"
              type="number"
              min={1}
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </Field>

          <div className="mt-7 space-y-1">
            {workstations.length > 0 ? (
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
