"use client";

import SectionWrapper from "@/components/deco/section-wrapper";
import FormWrapper from "@/components/tools/form-wrapper";
import { useRouter } from "@/i18n/navigation";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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

    if (!activeFactory || !activePlaythrough) return null;
    const editedFactory = editFactory(activeFactory.id, values);
    if (editedFactory) {
      router.push(
        `/tools/${activePlaythrough.id}/factories/${editedFactory.id}`,
      );
      toast.success(
        t("toasts.factoryEditSuccess", {
          factoryName: editedFactory.name,
        }),
      );
    }
  };

  const onCancel = () => {
    router.back();
  };

  // TODO add skeletons
  if (!activeFactory || !activePlaythrough) return null;

  return (
    <>
      <SectionWrapper size="noTopPadding" className="block">
        <FormWrapper form={form} onSubmit={onSubmit} onCancel={onCancel} />
      </SectionWrapper>
    </>
  );
};

export default EditFactoryPage;
