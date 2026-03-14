import { Table } from "@tanstack/react-table";

export function getMeta<TData>(table: Table<TData>) {
  return table.options.meta!;
}
