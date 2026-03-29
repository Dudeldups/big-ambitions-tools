"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { getEmployeeSalary } from "@/lib/calculations/math";
import { SALARY_BASE_MULT, SALARY_DIFF_MULT } from "@/lib/constants";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

const CreateFactoryPage = () => {
  const {
    activePlaythrough: { difficulty },
  } = useActivePlaythrough();

  const deliveryDriverSalary = getEmployeeSalary("deliveryDriver", difficulty);
  const logisticsManagerSalary = getEmployeeSalary(
    "logisticsManager",
    difficulty,
  );
  const factoryWorkerSalary = getEmployeeSalary("factoryWorker", difficulty);

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      workstations: [],
      openingHours: 24,
      vehicle1: "FreightTruckT1",
      employees: {
        deliveryDriver: {
          amount: 1,
          salary: deliveryDriverSalary,
        },
        logisticsManager: {
          amount: 1,
          salary: logisticsManagerSalary,
        },
        factoryWorker: {
          amount: 0,
          salary: factoryWorkerSalary,
        },
      },
    },
  });

  const { control, setValue } = form;

  const vehicle1 = useWatch({ control, name: "vehicle1" });
  const vehicle2 = useWatch({ control, name: "vehicle2" });
  const workstations = useWatch({ control, name: "workstations" });

  useEffect(() => {
    const derivedDriverAmount = [vehicle1, vehicle2].filter(Boolean).length;
    setValue("employees.deliveryDriver.amount", derivedDriverAmount, {
      shouldDirty: false,
    });
  }, [vehicle1, vehicle2, setValue]);

  useEffect(() => {
    setValue("employees.factoryWorker.amount", workstations.length, {
      shouldDirty: false,
    });
  }, [workstations, setValue]);

  const watchedValues = useWatch({ control });

  return (
    <div className="grid grid-cols-2 gap-8">
      <CreateFactoryForm form={form} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default CreateFactoryPage;
