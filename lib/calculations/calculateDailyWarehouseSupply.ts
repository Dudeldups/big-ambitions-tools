import { ImporterShoppingList } from "../utils/getShoppingList";

type DailySupplyItem = {
  name: string;
  amount: number;
};

export function calculateDailyWarehouseSupply(
  externalList: ImporterShoppingList[],
): DailySupplyItem[] {
  const map = new Map<string, number>();

  externalList.forEach((entry) => {
    entry.items.forEach((item) => {
      const prev = map.get(item.name) ?? 0;
      map.set(item.name, prev + item.amount);
    });
  });

  return Array.from(map.entries()).map(([name, weeklyAmount]) => ({
    name,
    amount: Math.ceil(weeklyAmount / 7),
  }));
}
