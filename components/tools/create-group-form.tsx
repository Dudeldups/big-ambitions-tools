"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import {
  FactoryGroupFormValues,
  factoryGroupSchema,
} from "@/lib/schemas/factoryGroup";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateGroupForm = () => {
  const { activePlaythrough } = useActivePlaythrough();
  const createFactoryGroup = usePlaythroughStore(
    (state) => state.createFactoryGroup,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations();

  const defaultValues = {
    name: "",
    color: "#ffffff",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FactoryGroupFormValues>({
    resolver: zodResolver(factoryGroupSchema),
    mode: "onChange",
    defaultValues,
  });

  const onSubmit = (values: FactoryGroupFormValues) => {
    if (!activePlaythrough) return;

    const save = createFactoryGroup(activePlaythrough.id, values);
    toast.success(t("toasts.groupSaveSuccess", { groupName: save.name }), {
      position: "bottom-right",
    });
    setIsModalOpen(false);
    reset(defaultValues);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Group className="size-5" />
          {t("modals.groupBtn")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.groupTitle")}</DialogTitle>
          <DialogDescription>{t("modals.groupDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <Label htmlFor="name">{t("modals.groupLabelName")}</Label>
              <Input
                id="name"
                placeholder={"Placeholder"}
                {...register("name")}
              />
              {errors.name?.message && (
                <FieldError className="text-destructive text-sm">
                  {t(errors.name.message)}
                </FieldError>
              )}
            </Field>

            <Field>
              <Label>{t("modals.groupLabelColor")}</Label>

              <Input
                type="color"
                className="h-12 cursor-pointer p-1"
                {...register("color")}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => reset(defaultValues)}>
                {t("general.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit">{t("general.confirm")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupForm;
