import {
  DELIVERY_DRIVER_WORKING_HOURS,
  HQ_WORKING_HOURS,
} from "./../constants";
import { EmployeeName } from "./employeeNames";

type DeliveryDriverWorkingHours = typeof DELIVERY_DRIVER_WORKING_HOURS;
type HQWorkingHours = typeof HQ_WORKING_HOURS;

export type Employee = {
  baseHourlyWage: number;
  hasParttimeDemand: boolean;
  customWorkingHours?: DeliveryDriverWorkingHours | HQWorkingHours;
};

export const employees = {
  deliveryDriver: {
    baseHourlyWage: 18,
    hasParttimeDemand: false,
    customWorkingHours: DELIVERY_DRIVER_WORKING_HOURS,
  },
  hrManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  purchasingAgent: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  logisticsManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  headhunter: {
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
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
} as const satisfies Record<EmployeeName, Employee>;
