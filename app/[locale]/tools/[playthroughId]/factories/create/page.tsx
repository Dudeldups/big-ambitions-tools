"use client";

import SectionWrapper from "@/components/deco/section-wrapper";
import FormWrapper from "@/components/tools/form-wrapper";
import { useRouter } from "@/i18n/navigation";
import { getEmployeeSalary } from "@/lib/calculations/math";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateFactoryPage = () => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const difficulty = activePlaythrough?.difficulty;

  const templateFactory = usePlaythroughState((state) => state.templateFactory);
  const setTemplateFactory = usePlaythroughStore(
    (state) => state.setTemplateFactory,
  );
  const createFactory = usePlaythroughStore((state) => state.createFactory);
  const addFactoryToPlaythrough = usePlaythroughStore(
    (state) => state.addFactoryToPlaythrough,
  );
  const router = useRouter();

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: templateFactory ?? {
      workstations: [],
      openingHours: 24,
      shelfAmount: 1,
      vehicles: [{ name: "FreightTruckT1" }],
      employees: {
        deliveryDriver: { amount: 1, salary: 0 },
        hrManager: { amount: 0, salary: 0 },
        logisticsManager: { amount: 1, salary: 0 },
        purchasingAgent: { amount: 0, salary: 0 },
        factoryWorker: { amount: 0, salary: 0 },
      },
    },
  });

  const { reset, getValues } = form;

  useEffect(() => {
    if (!difficulty) return;
    reset({
      ...getValues(),
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
  }, [difficulty, getValues, reset]);

  useEffect(() => {
    if (templateFactory) {
      reset(templateFactory);
      setTemplateFactory(undefined);
    }
  }, [reset, setTemplateFactory, templateFactory]);

  const onSubmit = (values: FactoryFormValues) => {
    const hasMissingName = values.name.trim() === "";
    if (hasMissingName) {
      values.name = t("tools.factoryPlanner.genericFactoryName", {
        productName: t(`products.${values.workstations[0].product}`),
      });
    }

    if (!activePlaythrough || templateFactory === null) return null;

    const newFactory = createFactory(values);
    addFactoryToPlaythrough(activePlaythrough.id, newFactory.id);
    router.push(`/tools/${activePlaythrough.id}/factories/${newFactory.id}`);
    toast.success(
      t("toasts.factorySaveSuccess", {
        factoryName: newFactory.name,
      }),
    );
  };

  const onCancel = () => {
    router.back();
  };

  // TODO add skeletons

  return (
    <>
      <SectionWrapper size="noTopPadding" className="block">
        <FormWrapper form={form} onSubmit={onSubmit} onCancel={onCancel} />
      </SectionWrapper>
    </>
  );
};

export default CreateFactoryPage;
