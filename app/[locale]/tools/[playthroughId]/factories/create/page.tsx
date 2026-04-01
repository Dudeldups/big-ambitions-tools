"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { getEmployeeSalary } from "@/lib/calculations/math";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useDerivedEmployees } from "@/lib/hooks/useDerivedEmployees";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { zodResolver } from "@hookform/resolvers/zod";
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
        hrManager: {
          amount: 0,
          salary: getEmployeeSalary("hrManager", difficulty),
        },
        logisticsManager: {
          amount: 1,
          salary: getEmployeeSalary("logisticsManager", difficulty),
        },
        purchasingAgent: {
          amount: 0,
          salary: getEmployeeSalary("purchasingAgent", difficulty),
        },
        factoryWorker: {
          amount: 0,
          salary: getEmployeeSalary("factoryWorker", difficulty),
        },
      },
    },
  });

  const { control, setValue, getValues } = form;

  const [workstations, openingHours, vehicle1, vehicle2, employees] = useWatch({
    control,
    name: ["workstations", "openingHours", "vehicle1", "vehicle2", "employees"],
  });

  useDerivedEmployees({
    workstations,
    openingHours,
    vehicle1,
    vehicle2,
    employees,
    getValues,
    setValue,
  });

  const watchedValues = useWatch({ control }) as FactoryFormValues;

  return (
    <div className="grid grid-cols-2 gap-8">
      <CreateFactoryForm form={form} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default CreateFactoryPage;
