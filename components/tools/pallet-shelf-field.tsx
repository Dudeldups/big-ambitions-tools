import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { cn } from "@/lib/utils";
import { getOptimalPalletShelfAmounts } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import { Check, CircleX, TriangleAlert } from "lucide-react";
import { gameData as gameData010 } from "@/data/game/0.10";

type Props = {
  className?: string;
  control: Control<FactoryFormValues>;
  errors: FieldErrors<FactoryFormValues>;
};

export function PalletShelfField({ className, control, errors }: Props) {
  const { t, rich } = useRichDefaults();
  const { activePlaythrough } = useActivePlaythrough();
  const [shelfAmount, workstations, openingHours] = useWatch({
    control,
    name: ["shelfAmount", "workstations", "openingHours"],
  });

  const gameData = activePlaythrough
    ? getPlaythroughGameData(activePlaythrough)
    : gameData010;
  const { full, limited } = getOptimalPalletShelfAmounts(
    workstations,
    openingHours,
    gameData,
  );
  const { daily, weekly, isOverflowing } = full;
  const hasProductionLimit = workstations.some(
    (workstation) => workstation.productionLimit !== undefined,
  );

  const hasWeekly = shelfAmount >= weekly;
  const hasDaily = shelfAmount >= daily;

  const palletShelfStringDaily = t("counts.palletShelf", { count: daily });
  const palletShelfStringWeekly = t("counts.palletShelf", { count: weekly });

  return (
    <Controller
      control={control}
      name="shelfAmount"
      render={({ field }) => (
        <div className={cn("flex gap-8 *:flex-1 @max-2xl:flex-col", className)}>
          <Field>
            <FieldLabel htmlFor="shelf-amount">
              {t("general.palletShelves")}
            </FieldLabel>
            <FieldDescription>
              {t("tools.factoryPlanner.information.palletDesc")}
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
                  {rich("tools.factoryPlanner.information.dailyAmount", {
                    count: daily,
                    object: palletShelfStringDaily,
                  })}
                </p>
                <p>
                  {rich("tools.factoryPlanner.information.weeklyAmount", {
                    count: weekly,
                    object: palletShelfStringWeekly,
                  })}
                </p>
                {hasProductionLimit && limited && limited.weekly !== weekly && (
                  <p>
                    {rich(
                      "tools.factoryPlanner.information.limitedWeeklyAmount",
                      {
                        count: limited.weekly,
                        object: t("counts.palletShelf", {
                          count: limited.weekly,
                        }),
                      },
                    )}
                  </p>
                )}
                {isOverflowing && (
                  <Tooltip>
                    <TooltipTrigger className="text-alert flex gap-2">
                      <TriangleAlert />
                      <p>
                        {t("tools.factoryPlanner.information.overflowWarning")}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("tools.factoryPlanner.information.overflowDesc")}
                    </TooltipContent>
                  </Tooltip>
                )}

                {hasWeekly ? (
                  <div className="text-success flex gap-2">
                    <Check className="shrink-0" />
                    <p>{t("tools.factoryPlanner.information.enoughWeekly")}</p>
                  </div>
                ) : hasDaily ? (
                  <div className="text-alert flex gap-2">
                    <TriangleAlert className="shrink-0" />
                    <p>{t("tools.factoryPlanner.information.enoughDaily")}</p>
                  </div>
                ) : (
                  <div className="text-destructive flex gap-2">
                    <CircleX className="shrink-0" />
                    <p>{t("tools.factoryPlanner.information.notEnough")}</p>
                  </div>
                )}
              </>
            ) : (
              <p>{t("tools.factoryPlanner.information.shelfExplanation")}</p>
            )}
          </div>
        </div>
      )}
    />
  );
}
