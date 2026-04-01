import { UseFormSetValue } from "react-hook-form";
import { FactoryFormValues } from "../schemas/factory";
import { useEffect, useRef } from "react";
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
  employees,
  setValue,
}: {
  workstations: FactoryFormValues["workstations"];
  openingHours: FactoryFormValues["openingHours"];
  vehicle1: FactoryFormValues["vehicle1"];
  vehicle2: FactoryFormValues["vehicle2"];
  employees: FactoryFormValues["employees"];
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

  useEffect(() => {
    const derivedDriverAmount = deriveDeliveryDriverAmount(
      vehicle1,
      vehicle2,
      stableEmployees,
    );

    setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
      shouldDirty: false,
    });
  }, [stableEmployees, setValue, vehicle1, vehicle2]);

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
