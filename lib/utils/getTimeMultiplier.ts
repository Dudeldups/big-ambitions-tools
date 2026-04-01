import { CalculationPeriod } from "../game/types";

export function getTimeMultiplier(
  calculationPeriod: CalculationPeriod,
  openingHours: number,
): number {
  switch (calculationPeriod) {
    case "hourly":
      return 1;
    case "daily":
      return openingHours;
    case "weekly":
      return openingHours * 7;
  }
}
