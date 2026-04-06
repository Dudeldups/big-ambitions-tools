import "@/__tests__/mocks/data-table";
import { machines, workstations } from "@/lib/game/machines";
import MachinesPage from "./page";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { MachineName } from "@/lib/game/machineNames";

describe("MachinesPage", () => {
  it("renders both tables", () => {
    renderWithIntl(<MachinesPage />);
    expect(screen.getAllByTestId("data-table")).toHaveLength(2);
  });

  it("passes correct machines data", () => {
    renderWithIntl(<MachinesPage />);
    const [machinesTable] = screen.getAllByTestId("row-data");
    const data = JSON.parse(machinesTable.getAttribute("data-value")!);

    expect(data).toHaveLength(Object.keys(machines).length);

    // verify the shape of the data, not the rendered text
    const firstMachineName = Object.keys(machines)[0] as MachineName;
    const firstMachine = machines[firstMachineName];

    expect(data[0].itemName).toBe(firstMachineName);
    expect(data[0].purchasePrice).toBe(firstMachine.purchasePrice);
  });

  it("passes correct workstations data", () => {
    renderWithIntl(<MachinesPage />);
    const [, workstationsTable] = screen.getAllByTestId("row-data");
    const data = JSON.parse(workstationsTable.getAttribute("data-value")!);

    expect(data).toHaveLength(Object.keys(workstations).length);

    const firstWorkstationName = Object.keys(workstations)[0];
    expect(data[0].itemName).toBe(firstWorkstationName);
  });
});
