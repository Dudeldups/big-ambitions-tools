import {
  DELIVERY_DRIVER_WORKING_HOURS,
  HQ_WORKING_HOURS,
} from "@/lib/constants";
import { EmployeeName } from "@/lib/game/employeeNames";
import { Employee } from "@/lib/game/types";

export const employees = {
  actor: {
    baseHourlyWage: 200,
    hasParttimeDemand: true,
  },
  cleaning: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  customerService: {
    baseHourlyWage: 16,
    hasParttimeDemand: true,
  },
  deliveryDriver: {
    baseHourlyWage: 18,
    hasParttimeDemand: true,
    customWorkingHours: DELIVERY_DRIVER_WORKING_HOURS,
  },
  dj: {
    baseHourlyWage: 20,
    hasParttimeDemand: true,
  },
  eventPlanner: {
    baseHourlyWage: 33,
    hasParttimeDemand: true,
  },
  factoryWorker: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  graphicDesigner: {
    baseHourlyWage: 35,
    hasParttimeDemand: true,
  },
  gymTrainer: {
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  hairStylist: {
    baseHourlyWage: 22,
    hasParttimeDemand: true,
  },
  headhunter: {
    baseHourlyWage: 30,
    hasParttimeDemand: true,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  hrManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: true,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  lawyer: {
    baseHourlyWage: 50,
    hasParttimeDemand: true,
  },
  logisticsManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: true,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  pricingManager: {
    baseHourlyWage: 30,
    hasParttimeDemand: true,
  },
  programmer: {
    baseHourlyWage: 36,
    hasParttimeDemand: true,
  },
  projectionist: {
    baseHourlyWage: 12,
    hasParttimeDemand: true,
  },
  purchasingAgent: {
    baseHourlyWage: 30,
    hasParttimeDemand: true,
    customWorkingHours: HQ_WORKING_HOURS,
  },
  securityGuard: {
    baseHourlyWage: 15,
    hasParttimeDemand: true,
  },
  stageCrew: {
    baseHourlyWage: 100,
    hasParttimeDemand: true,
  },
  travelAgent: {
    baseHourlyWage: 31,
    hasParttimeDemand: true,
  },
} as const satisfies Partial<Record<EmployeeName, Employee>>;
