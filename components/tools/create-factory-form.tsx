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
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WORKSTATION_NAMES } from "@/lib/game/machineNames";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import WorkstationSelects from "./workstation-selects";
import { products } from "@/lib/game/products";
import { ProductName } from "@/lib/game/productNames";
import { zodResolver } from "@hookform/resolvers/zod";

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

const CreateFactoryForm = () => {
  const t = useTranslations();
  const createFactory = usePlaythroughStore((state) => state.createFactory);
  const addFactoryToPlaythrough = usePlaythroughStore(
    (state) => state.addFactoryToPlaythrough,
  );
  const activePlaythroughId = usePlaythroughState((s) => s.activePlaythroughId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: { workstations: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workstations",
  });

  const onSubmit = (values: FactoryFormValues) => {
    if (!activePlaythroughId) {
      // TODO: add error messages
      toast.error("No active playthrough selected");
      return;
    }

    const hasMissingName = values.name.trim() === "";
    if (hasMissingName) {
      values.name = t("tools.factoryPlanner.genericFactoryName", {
        productName: values.workstations[0].product,
      });
    }

    const newFactory = createFactory(values);
    addFactoryToPlaythrough(activePlaythroughId, newFactory.id);
    toast.success(
      `Factory "${newFactory.name}" created and added to playthrough!`,
    );
    setIsModalOpen(false);
    reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-lg">
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0">
        <DialogHeader className="p-4">
          <DialogTitle>Create Factory</DialogTitle>
          <DialogDescription>
            Create a new factory and add it to the current playthrough.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="px-4">
            <Field>
              <Label htmlFor="name" {...register("name")}>
                Factory Name
              </Label>
              <Input id="name" {...register("name")} autoComplete="off" />
              {errors.name?.message && (
                <p className="text-destructive text-sm">
                  {t(errors.name.message)}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="description" {...register("description")}>
                Description
              </Label>
              <Textarea id="description" {...register("description")} />
              {errors.description?.message && (
                <p className="text-destructive text-sm">
                  {t(errors.description.message)}
                </p>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="px-4">
            <Field>
              <FieldDescription>Workstations</FieldDescription>

              {fields.map((field, index) => (
                <WorkstationSelects
                  key={field.id}
                  control={control}
                  index={index}
                  append={append}
                  remove={remove}
                  setValue={setValue}
                />
              ))}

              {errors.workstations?.message && (
                <p className="text-destructive text-sm">
                  {t(errors.workstations.message)}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: WORKSTATION_NAMES[0],
                    product: productData.find(
                      (p) => p.workstation === WORKSTATION_NAMES[0],
                    )!.name as ProductName,
                  })
                }
              >
                Add Workstation
              </Button>
            </Field>
          </FieldGroup>

          <DialogFooter className="bg-card p-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <DialogClose asChild>
              <Button variant="outline">{t("general.cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("general.confirm")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactoryForm;
