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
  employees,
  getValues,
  setValue,
}: {
  workstations: FactoryFormValues["workstations"];
  openingHours: FactoryFormValues["openingHours"];
  vehicle1: FactoryFormValues["vehicle1"];
  vehicle2: FactoryFormValues["vehicle2"];
  employees: FactoryFormValues["employees"];
  getValues: UseFormGetValues<FactoryFormValues>;
  setValue: UseFormSetValue<FactoryFormValues>;
}) => {
  useEffect(() => {
    const derivedDriverAmount = deriveDeliveryDriverAmount(
      vehicle1,
      vehicle2,
      getValues("employees"),
    );

    setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
      shouldDirty: false,
    });
  }, [getValues, setValue, vehicle1, vehicle2]);

  useEffect(() => {
    const derivedFactoryWorkerAmount = deriveFactoryWorkerAmount(
      workstations.length,
      openingHours,
    );

    setValue("employees.factoryWorker.amount", derivedFactoryWorkerAmount, {
      shouldDirty: false,
    });
  }, [openingHours, setValue, workstations.length]);

  useEffect(() => {
    const derivedHrAmount = deriveHrManagerAmount(employees);

    if (employees?.hrManager?.amount === derivedHrAmount) return;

    setValue("employees.hrManager.amount", derivedHrAmount, {
      shouldDirty: false,
    });
  }, [employees, setValue]);
};
