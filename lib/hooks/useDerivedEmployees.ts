import { UseFormSetValue } from "react-hook-form";
import {
  FactoryFormValues,
  FormOpeningHours,
  FormVehicles,
  FormWorkstations,
} from "../schemas/factory";
import { useEffect } from "react";
import {
  deriveDeliveryDriverAmount,
  deriveFactoryWorkerAmount,
  deriveHrManagerAmount,
} from "../calculations/derivedFactoryData";
import { FormEmployees } from "../schemas/employee";
import { useUiStore } from "../stores/uiStore";

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
  const isOptimalWorkerChecked = useUiStore((s) => s.isOptimalWorkerChecked);

  useEffect(() => {
    const { salary, amount } = employees.deliveryDriver;
    const derivedDriverAmount = deriveDeliveryDriverAmount(vehicles, salary);
    if (amount !== derivedDriverAmount) {
      setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
        shouldDirty: false,
      });
    }
  }, [employees.deliveryDriver, setValue, vehicles]);

  useEffect(() => {
    if (!isOptimalWorkerChecked) return;

    const derived = deriveFactoryWorkerAmount(workstations, openingHours);
    const currentAmount = employees.factoryWorker.amount;

    if (currentAmount !== derived) {
      setValue("employees.factoryWorker.amount", derived, {
        shouldDirty: false,
      });
    }
  }, [
    employees.factoryWorker.amount,
    isOptimalWorkerChecked,
    openingHours,
    setValue,
    workstations,
  ]);

  useEffect(() => {
    const derived = deriveHrManagerAmount(employees);
    const currentAmount = employees.hrManager?.amount;

    if (currentAmount !== derived) {
      setValue("employees.hrManager.amount", derived, { shouldDirty: false });
    }
  }, [employees, setValue]);
};
