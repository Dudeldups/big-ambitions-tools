import { Screen } from "@testing-library/react";

export function getTableData(screen: Screen) {
  return JSON.parse(screen.getByTestId("row-data").getAttribute("data-value")!);
}
