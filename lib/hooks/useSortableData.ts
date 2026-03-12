import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";

export function useSortableData<T>(
  data: T[],
  accessors: Record<string, (item: T) => string | number>,
  initialField?: string,
) {
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: SortDirection;
  }>({
    field: initialField ?? Object.keys(accessors)[0],
    direction: "asc",
  });

  const sortedData = useMemo(() => {
    const sortable = [...data];

    const accessor = accessors[sortConfig.field];
    if (!accessor) return sortable;

    sortable.sort((a, b) => {
      const aValue = accessor(a);
      const bValue = accessor(b);

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortable;
  }, [data, sortConfig, accessors]);

  const requestSort = (field: string) => {
    setSortConfig((current) => {
      if (current.field === field) {
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { field, direction: "asc" };
    });
  };

  return { sortedData, sortConfig, requestSort };
}
