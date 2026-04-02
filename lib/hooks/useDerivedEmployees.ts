import { UseFormSetValue } from "react-hook-form";
import {
  FactoryFormValues,
  FormOpeningHours,
  FormVehicles,
  FormWorkstations,
} from "../schemas/factory";
import { useEffect, useRef } from "react";
import {
  deriveDeliveryDriverAmount,
  deriveFactoryWorkerAmount,
  deriveHrManagerAmount,
} from "../calculations/derivedFactoryData";
import { FormEmployees } from "../schemas/employee";

export const useDerivedEmployees = ({
  workstations,
  openingHours,
  vehicles,
  employees,
  setValue,
}: {
  workstations: FormWorkstations;
  openingHours: FormOpeningHours;
  vehicles: FormVehicles;
  employees: FormEmployees;
  setValue: UseFormSetValue<FactoryFormValues>;
}) => {
  const useDeepCompareMemo = <T>(value: T): T => {
    const ref = useRef<T>(value);
    if (JSON.stringify(ref.current) !== JSON.stringify(value)) {
      ref.current = value;
    }
    return ref.current;
  };

  const stableWorkstations = useDeepCompareMemo(workstations);
  const stableEmployees = useDeepCompareMemo(employees);
  const stableVehicles = useDeepCompareMemo(vehicles);

  useEffect(() => {
    const derivedDriverAmount = deriveDeliveryDriverAmount(
      stableVehicles,
      stableEmployees,
    );

    setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
      shouldDirty: false,
    });
  }, [stableEmployees, setValue, stableVehicles]);

  useEffect(() => {
    const derivedFactoryWorkerAmount = deriveFactoryWorkerAmount(
      stableWorkstations,
      openingHours,
    );

    setValue("employees.factoryWorker.amount", derivedFactoryWorkerAmount, {
      shouldDirty: false,
    });
  }, [openingHours, setValue, stableWorkstations]);

  useEffect(() => {
    const derivedHrAmount = deriveHrManagerAmount(stableEmployees);
    if (stableEmployees?.hrManager?.amount === derivedHrAmount) return;
    setValue("employees.hrManager.amount", derivedHrAmount, {
      shouldDirty: false,
    });
  }, [stableEmployees, setValue]);
};
