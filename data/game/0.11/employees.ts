import {
  DELIVERY_DRIVER_WORKING_HOURS,
  HQ_WORKING_HOURS,
} from "@/lib/constants";
import { EmployeeName } from "@/lib/game/employeeNames";
import { Employee } from "@/lib/game/types";

export const employees = {
  customerService: {
    id: 0,
    baseHourlyWage: 16,
    hasParttimeDemand: true,
  },
  cleaning: {
    id: 1,
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  lawyer: {
    id: 2,
    baseHourlyWage: 50,
    hasParttimeDemand: true,
  },
  purchasingAgent: {
    id: 3,
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  logisticsManager: {
    id: 4,
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  deliveryDriver: {
    id: 5,
    baseHourlyWage: 18,
    hasParttimeDemand: false,
    customWorkingHours: DELIVERY_DRIVER_WORKING_HOURS,
  },
  programmer: {
    id: 6,
    baseHourlyWage: 25,
    hasParttimeDemand: true,
  },
  hrManager: {
    id: 7,
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  graphicDesigner: {
    id: 8,
    baseHourlyWage: 25,
    hasParttimeDemand: true,
  },
  dj: {
    id: 10,
    baseHourlyWage: 20,
    hasParttimeDemand: true,
  },
  hairStylist: {
    id: 11,
    baseHourlyWage: 22,
    hasParttimeDemand: true,
  },
  securityGuard: {
    id: 12,
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  headhunter: {
    id: 13,
    baseHourlyWage: 30,
    hasParttimeDemand: false,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  factoryWorker: {
    id: 14,
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  gymTrainer: {
    id: 15,
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  actor: {
    id: 17,
    baseHourlyWage: 200,
    hasParttimeDemand: true,
  },
  stageCrew: {
    id: 18,
    baseHourlyWage: 100,
    hasParttimeDemand: true,
  },
  projectionist: {
    id: 19,
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
} as const satisfies Partial<Record<EmployeeName, Employee>>;
