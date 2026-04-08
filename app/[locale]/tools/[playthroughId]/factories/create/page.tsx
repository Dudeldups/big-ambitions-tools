"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { useRouter } from "@/i18n/navigation";
import { getEmployeeSalary } from "@/lib/calculations/math";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useDerivedEmployees } from "@/lib/hooks/useDerivedEmployees";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const CreateFactoryPage = () => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const difficulty = activePlaythrough?.difficulty;

  const createFactory = usePlaythroughStore((state) => state.createFactory);
  const addFactoryToPlaythrough = usePlaythroughStore(
    (state) => state.addFactoryToPlaythrough,
  );
  const router = useRouter();

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      workstations: [],
      openingHours: 24,
      vehicles: [{ name: "FreightTruckT1" }],
      deliveryPeriod: "weekly",
      employees: {
        deliveryDriver: { amount: 1, salary: 0 },
        hrManager: { amount: 0, salary: 0 },
        logisticsManager: { amount: 1, salary: 0 },
        purchasingAgent: { amount: 0, salary: 0 },
        factoryWorker: { amount: 0, salary: 0 },
      },
    },
  });

  useEffect(() => {
    if (!difficulty) return;
    form.reset({
      ...form.getValues(),
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
    });
  }, [difficulty, form]);

  const { control, setValue } = form;

  const [workstations, openingHours, vehicles, employees] = useWatch({
    control,
    name: ["workstations", "openingHours", "vehicles", "employees"],
  });

  useDerivedEmployees({
    workstations,
    openingHours,
    vehicles,
    employees,
    setValue,
  });

  const watchedValues = useWatch({ control }) as FactoryFormValues;

  const onSubmit = (values: FactoryFormValues) => {
    const hasMissingName = values.name.trim() === "";
    if (hasMissingName) {
      values.name = t("tools.factoryPlanner.genericFactoryName", {
        productName: t(`products.${values.workstations[0].product}`),
      });
    }

    if (!activePlaythrough) return null;

    const newFactory = createFactory(values);
    addFactoryToPlaythrough(activePlaythrough.id, newFactory.id);
    router.push(`/tools/${activePlaythrough.id}/factories`);
    toast.success(
      t("toasts.factorySaveSuccess", {
        factoryName: newFactory.name,
      }),
    );
  };

  const onCancel = () => {
    router.push(`/tools/${activePlaythrough?.id}/factories`);
  };

  // TODO add skeletons

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <CreateFactoryForm form={form} onSubmit={onSubmit} onCancel={onCancel} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default CreateFactoryPage;
