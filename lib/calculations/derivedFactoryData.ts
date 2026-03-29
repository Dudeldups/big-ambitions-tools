import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { WorkstationName } from "../game/machineNames";
import { workstations } from "../game/machines";
import { DeepPartial } from "../game/types";
import { VehicleName } from "../game/vehicleNames";
import { vehicles } from "../game/vehicles";
import { FactoryFormValues } from "../schemas/factory";
import { getWorkstationPrice } from "./math";

export const deriveWorkstationCost = (
  wsName: WorkstationName | undefined,
): number => {
  if (!wsName) return 0;
  return getWorkstationPrice(workstations[wsName]);
};

export const deriveVehicleCost = (
  vehicleName: VehicleName | undefined,
): number => {
  if (!vehicleName) return 0;
  return vehicles[vehicleName].purchasePrice;
};

export const deriveEmployeeCost = (
  employeeName: EmployeeName | undefined,
  values: DeepPartial<FactoryFormValues>,
): number => {
  if (!employeeName || !values.openingHours) return 0;
  const employee = employees[employeeName];
  const formEmployee =
    values.employees?.[employeeName as keyof FactoryFormValues["employees"]];
  if (!formEmployee?.salary) return 0;
  const workingHours =
    "customWorkingHours" in employee
      ? employee.customWorkingHours
      : values.openingHours;
  return formEmployee.salary * workingHours * 7;
};
