import { CalculationPeriod } from "../game/types";

export function getTimeMultiplier(
  calculationPeriod: CalculationPeriod,
  openingHours: number,
): number {
  switch (calculationPeriod) {
    case "hourly":
      return 1 / openingHours;
    case "daily":
      return 1;
    case "weekly":
      return 7;
  }
}
