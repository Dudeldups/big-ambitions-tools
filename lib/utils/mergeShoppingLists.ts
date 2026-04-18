import { ImporterShoppingList } from "./getShoppingList";

export const mergeShoppingLists = (
  lists: ImporterShoppingList[],
): ImporterShoppingList[] => {
  const importerMap = new Map<
    string,
    Map<string, { amount: number; value: number }>
  >();

  for (const entry of lists) {
    if (!importerMap.has(entry.importer)) {
      importerMap.set(entry.importer, new Map());
    }

    const itemMap = importerMap.get(entry.importer)!;

    for (const item of entry.items) {
      const existing = itemMap.get(item.name);

      if (existing) {
        existing.amount += item.amount;
        existing.value += item.value;
      } else {
        itemMap.set(item.name, {
          amount: item.amount,
          value: item.value,
        });
      }
    }
  }

  return Array.from(importerMap.entries()).map(([importer, itemsMap]) => ({
    importer,
    items: Array.from(itemsMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      value: data.value,
    })),
  }));
};
