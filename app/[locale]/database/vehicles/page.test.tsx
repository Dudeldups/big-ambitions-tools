import "@/__tests__/mocks/data-table";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import VehiclesPage from "./page";
import { VehicleName } from "@/lib/game/vehicleNames";
import { getTableData } from "@/__tests__/helpers/table-page";
import { getGameData } from "@/lib/game/registry";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";

describe("VehiclesPage", () => {
  beforeEach(() => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: true,
      gameVersion: DEFAULT_GAME_VERSION,
    });
  });

  it("renders the data table", () => {
    renderWithIntl(<VehiclesPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes correct number of vehicles", () => {
    renderWithIntl(<VehiclesPage />);
    const data = getTableData(screen);
    expect(data).toHaveLength(
      Object.keys(getGameData(DEFAULT_GAME_VERSION).vehicles).length,
    );
  });

  it("passes correct vehicle data shape", () => {
    renderWithIntl(<VehiclesPage />);
    const data = getTableData(screen);
    const { vehicles } = getGameData(DEFAULT_GAME_VERSION);
    const firstVehicleName = Object.keys(vehicles)[0] as VehicleName;
    const firstVehicle = vehicles[firstVehicleName];

    expect(firstVehicle).toBeDefined();
    expect(data[0].itemName).toBe(firstVehicleName);
    expect(data[0]).toMatchObject(firstVehicle!);
  });
});
