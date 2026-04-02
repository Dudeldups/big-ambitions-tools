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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";
import { useAppState } from "@/lib/hooks/useAppState";
import {
  PlaythroughFormValues,
  playthroughSchema,
} from "@/lib/schemas/playthrough";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const CreatePlaythroughForm = () => {
  const createPlaythrough = usePlaythroughStore(
    (state) => state.createPlaythrough,
  );
  const appDifficulty = useAppState((state) => state.difficulty);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaythroughFormValues>({
    resolver: zodResolver(playthroughSchema),
    mode: "onChange",
    defaultValues: {
      characterName: "",
      difficulty: appDifficulty || "easy",
    },
  });

  const onSubmit = (values: PlaythroughFormValues) => {
    const save = createPlaythrough(values);
    toast.success(
      t("toasts.playthroughSaveSuccess", { characterName: save.characterName }),
      {
        position: "bottom-right",
      },
    );
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (appDifficulty) {
      reset((values) => ({
        ...values,
        difficulty: appDifficulty,
      }));
    }
  }, [appDifficulty, reset]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-lg">
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("tools.dashboard.createPlaythroughTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("tools.dashboard.createPlaythroughDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <Label htmlFor="characterName">
                {t("general.characterName")}
              </Label>
              <Input
                id="characterName"
                placeholder={t("tools.dashboard.createPlaythroughPlaceholder")}
                {...register("characterName")}
              />
              {errors.characterName?.message && (
                <p className="text-destructive text-sm">
                  {t(errors.characterName.message)}
                </p>
              )}
            </Field>

            <Field>
              <Label>{t("general.difficulty")}</Label>
              {appDifficulty ? (
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <div key={d} className="flex items-center gap-2">
                          <RadioGroupItem value={d} id={d} />
                          <Label
                            htmlFor={d}
                            className="cursor-pointer font-normal capitalize"
                          >
                            {t(`general.difficultyOptions.${d}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              ) : (
                <Spinner />
              )}

              {errors.difficulty?.message && (
                <FieldError>{t(errors.difficulty.message)}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
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

export default CreatePlaythroughForm;
