import "@/__tests__/mocks/data-table";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { vehicles } from "@/lib/game/vehicles";
import VehiclesPage from "./page";
import { VehicleName } from "@/lib/game/vehicleNames";
import { getTableData } from "@/__tests__/helpers/table-page";

describe("VehiclesPage", () => {
  it("renders the data table", () => {
    renderWithIntl(<VehiclesPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes correct number of vehicles", () => {
    renderWithIntl(<VehiclesPage />);
    const data = getTableData(screen);
    expect(data).toHaveLength(Object.keys(vehicles).length);
  });

  it("passes correct vehicle data shape", () => {
    renderWithIntl(<VehiclesPage />);
    const data = getTableData(screen);
    const firstVehicleName = Object.keys(vehicles)[0] as VehicleName;

    expect(data[0].itemName).toBe(firstVehicleName);
    expect(data[0]).toMatchObject(vehicles[firstVehicleName]);
  });
});
