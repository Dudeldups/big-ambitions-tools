import { ImporterShoppingList } from "../utils/getShoppingList";

export type DeliveryListItem = {
  name: string;
  amount: number;
};

export function calculateDailyWarehouseSupply(
  factoryList: ImporterShoppingList[],
): DeliveryListItem[] {
  const map = new Map<string, number>();

  factoryList.forEach((entry) => {
    entry.items.forEach((item) => {
      const prev = map.get(item.name) ?? 0;
      map.set(item.name, prev + item.amount);
    });
  });

  return Array.from(map.entries()).map(([name, weeklyAmount]) => ({
    name,
    amount: weeklyAmount,
  }));
}
