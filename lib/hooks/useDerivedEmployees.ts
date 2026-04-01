import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { FactoryFormValues } from "../schemas/factory";
import { useEffect } from "react";
import {
  deriveDeliveryDriverAmount,
  deriveFactoryWorkerAmount,
  deriveHrManagerAmount,
} from "../calculations/derivedFactoryData";

export const useDerivedEmployees = ({
  workstations,
  openingHours,
  vehicle1,
  vehicle2,
  getValues,
  setValue,
}: {
  workstations: FactoryFormValues["workstations"];
  openingHours: FactoryFormValues["openingHours"];
  vehicle1: FactoryFormValues["vehicle1"];
  vehicle2: FactoryFormValues["vehicle2"];
  getValues: UseFormGetValues<FactoryFormValues>;
  setValue: UseFormSetValue<FactoryFormValues>;
}) => {
  useEffect(() => {
    const employees = getValues("employees");

    const derivedFactoryWorkerAmount = deriveFactoryWorkerAmount(
      workstations.length,
      openingHours,
    );

    const derivedDriverAmount = deriveDeliveryDriverAmount(
      vehicle1,
      vehicle2,
      employees,
    );

    const simulatedEmployees = {
      ...employees,
      factoryWorker: {
        ...employees?.factoryWorker,
        amount: derivedFactoryWorkerAmount,
      },
      deliveryDriver: {
        ...employees?.deliveryDriver,
        amount: derivedDriverAmount,
      },
    };

    const derivedHrAmount = deriveHrManagerAmount(simulatedEmployees);

    const updatedEmployees = {
      ...simulatedEmployees,
      hrManager: {
        ...employees?.hrManager,
        amount: derivedHrAmount,
      },
    };

    setValue("employees", updatedEmployees, { shouldDirty: false });
  }, [workstations, openingHours, vehicle1, vehicle2, getValues, setValue]);
};
