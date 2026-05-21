import { ProductName } from "../game/productNames";
import { GameData } from "../game/types";
import { FormWorkstations } from "../schemas/factory";

export type EffectiveProductProduction = {
  salesAmount: number;
  fullRatePerHour: number;
  effectiveRatePerHour: number;
  fullDailyAmount: number;
  effectiveDailyAmount: number;
  fullWeeklyAmount: number;
  effectiveWeeklyAmount: number;
  productionLimit?: number;
};

const resolveProductionLimit = (
  currentLimit: number | undefined,
  nextLimit: number | undefined,
) => {
  if (currentLimit === undefined) return nextLimit;
  if (nextLimit === undefined) return currentLimit;

  return Math.min(currentLimit, nextLimit);
};

export const getEffectiveProductionByProduct = (
  workstations: FormWorkstations,
  openingHours: number,
  gameData: GameData,
): Partial<Record<ProductName, EffectiveProductProduction>> => {
  const grouped = workstations.reduce(
    (acc, ws) => {
      const product = gameData.products[ws.product]!;
      const prev = acc[ws.product] ?? {
        salesAmount: 0,
        fullRatePerHour: 0,
        productionLimit: undefined,
      };

      acc[ws.product] = {
        salesAmount: prev.salesAmount + (ws.salesAmount ?? 0),
        fullRatePerHour:
          prev.fullRatePerHour + product.productionRate * ws.amount,
        productionLimit: resolveProductionLimit(
          prev.productionLimit,
          ws.productionLimit,
        ),
      };

      return acc;
    },
    {} as Partial<
      Record<
        ProductName,
        {
          salesAmount: number;
          fullRatePerHour: number;
          productionLimit?: number;
        }
      >
    >,
  );

  return Object.fromEntries(
    Object.entries(grouped).map(([productName, data]) => {
      const fullDailyAmount = data.fullRatePerHour * openingHours;
      const fullWeeklyAmount = fullDailyAmount * 7;
      const effectiveWeeklyAmount =
        data.productionLimit === undefined
          ? fullWeeklyAmount
          : Math.min(fullWeeklyAmount, data.productionLimit);
      const effectiveDailyAmount = effectiveWeeklyAmount / 7;
      const effectiveRatePerHour =
        openingHours > 0 ? effectiveDailyAmount / openingHours : 0;

      return [
        productName,
        {
          salesAmount: data.salesAmount,
          fullRatePerHour: data.fullRatePerHour,
          effectiveRatePerHour,
          fullDailyAmount,
          effectiveDailyAmount,
          fullWeeklyAmount,
          effectiveWeeklyAmount,
          productionLimit: data.productionLimit,
        },
      ];
    }),
  ) as Partial<Record<ProductName, EffectiveProductProduction>>;
};
