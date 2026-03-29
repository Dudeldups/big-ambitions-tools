import {
  EXPORT_PRICE_MULT,
  PUBLIC_PRICE_MULT,
  SALARY_BASE_MULT,
  SALARY_DIFF_MULT,
} from "../constants";
import { IMPORT_PRICE_BASE_MULT } from "../constants";
import { EmployeeName } from "../game/employeeNames";
import { employees } from "../game/employees";
import { machines, Workstation } from "../game/machines";
import { Difficulty } from "../game/types";

export const getImportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
  priceIndex: number = 1,
) => {
  return (
    wholesalePrice *
    IMPORT_PRICE_BASE_MULT *
    PUBLIC_PRICE_MULT[difficulty] *
    priceIndex
  );
};

export const getExportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
  priceIndex: number = 1,
) => {
  return (
    wholesalePrice *
    PUBLIC_PRICE_MULT[difficulty] *
    EXPORT_PRICE_MULT[difficulty] *
    priceIndex
  );
};

export const getEmployeeSalary = (
  employeeName: EmployeeName,
  difficulty: Difficulty,
) => {
  const employee = employees[employeeName];

  return Math.round(
    SALARY_BASE_MULT * SALARY_DIFF_MULT[difficulty] * employee.baseHourlyWage,
  );
};

export function getWorkstationPrice(ws: Workstation) {
  return ws.neededMachines.reduce(
    (sum, machineName) => sum + machines[machineName].purchasePrice,
    0,
  );
}
