"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { deriveFactoryWorkerAmount } from "@/lib/calculations/derivedFactoryData";
import { getEmployeeSalary } from "@/lib/calculations/math";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

const CreateFactoryPage = () => {
  const {
    activePlaythrough: { difficulty },
  } = useActivePlaythrough();

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      workstations: [],
      openingHours: 24,
      vehicle1: "FreightTruckT1",
      includeInventory: true,
      employees: {
        deliveryDriver: {
          amount: 1,
          salary: getEmployeeSalary("deliveryDriver", difficulty),
        },
        logisticsManager: {
          amount: 1,
          salary: getEmployeeSalary("logisticsManager", difficulty),
        },
        factoryWorker: {
          amount: 0,
          salary: getEmployeeSalary("factoryWorker", difficulty),
        },
        purchasingAgent: {
          amount: 0,
          salary: getEmployeeSalary("purchasingAgent", difficulty),
        },
      },
    },
  });

  const { control, setValue } = form;

  const vehicle1 = useWatch({ control, name: "vehicle1" });
  const vehicle2 = useWatch({ control, name: "vehicle2" });
  const openingHours = useWatch({ control, name: "openingHours" });
  const workstations = useWatch({ control, name: "workstations" });

  useEffect(() => {
    const derivedDriverAmount = [vehicle1, vehicle2].filter(Boolean).length;
    setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
      shouldDirty: false,
    });
  }, [vehicle1, vehicle2, setValue]);

  useEffect(() => {
    const derivedWorkstationAmount = deriveFactoryWorkerAmount(
      workstations.length,
      openingHours,
    );
    setValue("employees.factoryWorker.amount", derivedWorkstationAmount, {
      shouldDirty: false,
    });
  }, [workstations, setValue, openingHours]);

  const watchedValues = useWatch({ control });

  return (
    <div className="grid grid-cols-2 gap-8">
      <CreateFactoryForm form={form} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default CreateFactoryPage;
