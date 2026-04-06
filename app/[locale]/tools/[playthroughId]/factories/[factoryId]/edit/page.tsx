"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { useRouter } from "@/i18n/navigation";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useDerivedEmployees } from "@/lib/hooks/useDerivedEmployees";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const EditFactoryPage = () => {
  const t = useTranslations();
  const { activeFactory } = useActiveFactory();
  const { activePlaythrough } = useActivePlaythrough();
  const editFactory = usePlaythroughStore((state) => state.editFactory);
  const router = useRouter();

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      ...activeFactory,
    },
  });

  const onSubmit = (values: FactoryFormValues) => {
    const hasMissingName = values.name.trim() === "";
    if (hasMissingName) {
      values.name = t("tools.factoryPlanner.genericFactoryName", {
        productName: t(`products.${values.workstations[0].product}`),
      });
    }

    const editedFactory = editFactory(activeFactory.id, values);
    if (editedFactory) {
      router.push(`/tools/${activePlaythrough.id}/factories`);
      toast.success(
        t("toasts.factoryEditSuccess", {
          factoryName: editedFactory.name,
        }),
      );
    }
  };

  const onCancel = () => {
    router.push(`/tools/${activePlaythrough.id}/factories/${activeFactory.id}`);
  };

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

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <CreateFactoryForm form={form} onSubmit={onSubmit} onCancel={onCancel} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default EditFactoryPage;
