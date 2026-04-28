"use client";

import { Button } from "@/components/ui/button";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormReturn, useWatch } from "react-hook-form";
import { safeLog } from "@/lib/utils/safeLog";
import CancelConfirmModal from "../cancel-confirm-modal";
import FormEmployees from "./form-employees";
import FormInformation from "./form-information";
import FormVehicles from "./form-vehicles";
import FormWorkstations from "./form-workstations";
import { useUiStore } from "@/lib/stores/uiStore";
import { useEffect } from "react";
import DefaultHgroup from "../deco/default-hgroup";
import { Separator } from "../ui/separator";

type CreateFactoryFormProps = {
  form: UseFormReturn<FactoryFormValues>;
  onSubmit: (data: FactoryFormValues) => void;
  onCancel: () => void;
};

const CreateFactoryForm = ({
  form,
  onSubmit,
  onCancel,
}: CreateFactoryFormProps) => {
  const t = useTranslations();
  const setIsOptimalWorkerChecked = useUiStore(
    (s) => s.setIsOptimalWorkerChecked,
  );

  const { register, handleSubmit, reset, control } = form;

  const openingHours = useWatch({ control, name: "openingHours" });

  const onError = (errors: FieldErrors) => {
    safeLog("Form state:", form.getValues());
    safeLog("Form errors:", errors);
  };

  useEffect(() => {
    setIsOptimalWorkerChecked(true);
  }, [setIsOptimalWorkerChecked]);

  return (
    <div className="space-y-8">
      <DefaultHgroup
        title={t("tools.factoryPlanner.title")}
        caption={t("tools.factoryPlanner.desc")}
      />

      <Separator />

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="@container/form space-y-10"
      >
        <FormInformation form={form} openingHours={openingHours} t={t} />

        <FormEmployees register={register} t={t} />

        <FormVehicles control={control} t={t} />

        <FormWorkstations form={form} t={t} />

        <div className="bg-card rounded-md">
          <div className="flex w-full max-w-xl flex-wrap gap-4 p-4 *:flex-1">
            <Button type="submit">{t("general.confirm")}</Button>
            <CancelConfirmModal
              buttonText={t("general.cancel")}
              modalText={t("modals.discardChanges")}
              modalDescription={t("modals.discardDesc")}
              onModalSubmit={onCancel}
            />
            <CancelConfirmModal
              buttonText={t("general.reset")}
              modalText={t("modals.resetForm")}
              modalDescription={t("modals.resetDesc")}
              onModalSubmit={reset}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateFactoryForm;
