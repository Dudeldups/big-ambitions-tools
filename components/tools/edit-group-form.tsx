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
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditGroupFormProps = {
  groupId: string;
};

const EditGroupForm = ({ groupId }: EditGroupFormProps) => {
  const { activePlaythrough } = useActivePlaythrough();
  const group = usePlaythroughStore((s) =>
    activePlaythrough ? s.getGroupById(activePlaythrough.id, groupId) : null,
  );
  const editFactoryGroup = usePlaythroughStore(
    (state) => state.editFactoryGroup,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FactoryGroupFormValues>({
    resolver: zodResolver(factoryGroupSchema),
    mode: "onChange",
    defaultValues: {
      name: group?.name ?? "",
      color: group?.color ?? "#ffffff",
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        color: group.color,
      });
    }
  }, [group, reset]);

  const onSubmit = (values: FactoryGroupFormValues) => {
    if (!activePlaythrough) return;

    const save = editFactoryGroup(activePlaythrough.id, groupId, values);

    if (!save) {
      toast.error(t("toasts.genericError"), {
        position: "bottom-right",
      });
    } else {
      toast.success(t("toasts.groupEditSuccess", { groupName: save.name }), {
        position: "bottom-right",
      });
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="size-5" />
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
              <Input id="name" {...register("name")} />
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
              <Button variant="outline" onClick={() => reset()}>
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

export default EditGroupForm;
