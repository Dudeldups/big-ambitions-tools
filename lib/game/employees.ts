import { EmployeeName } from "./employeeNames";

export type Employee = {
  baseHourlyWage: number;
  hasParttimeDemand: boolean;
};

export const employees: Record<EmployeeName, Employee> = {
  deliveryDriver: {
    baseHourlyWage: 18,
    hasParttimeDemand: false,
  },
  hrManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
  },
  purchasingAgent: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
  },
  logisticsManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
  },
  headhunter: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
  },
  factoryWorker: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  customerService: {
    baseHourlyWage: 16,
    hasParttimeDemand: true,
  },
  cleaning: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  lawyer: {
    baseHourlyWage: 50,
    hasParttimeDemand: true,
  },
  projectionist: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  hairStylist: {
    baseHourlyWage: 22,
    hasParttimeDemand: true,
  },
  securityGuard: {
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  graphicDesigner: {
    baseHourlyWage: 25,
    hasParttimeDemand: true,
  },
  stageCrew: {
    baseHourlyWage: 100,
    hasParttimeDemand: true,
  },
  actor: {
    baseHourlyWage: 200,
    hasParttimeDemand: true,
  },
  dj: {
    baseHourlyWage: 20,
    hasParttimeDemand: true,
  },
  gymTrainer: {
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  programmer: {
    baseHourlyWage: 25,
    hasParttimeDemand: true,
  },
};
