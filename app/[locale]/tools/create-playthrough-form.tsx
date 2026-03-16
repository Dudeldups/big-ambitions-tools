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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { DIFFICULTIES } from "@/lib/constants";
import { useAppState } from "@/lib/hooks/useAppState";
import {
  PlaythroughFormValues,
  playthroughSchema,
} from "@/lib/schemas/playthrough";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const CreatePlaythroughForm = () => {
  const addPlaythrough = usePlaythroughStore((state) => state.addPlaythrough);
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
    console.log("onSubmit called", values);
    const save = addPlaythrough(values);
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
        <Button variant="outline">Create new playthrough</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playthrough</DialogTitle>
          <DialogDescription>
            Create a new save for your current playthrough. Select the
            difficulty so the tools can calculate the correct prices for the
            products and ingredients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <Label htmlFor="characterName">Character Name</Label>
              <Input
                id="characterName"
                placeholder="e.g. John Manhattan"
                {...register("characterName")}
              />
              {errors.characterName && (
                <p className="text-destructive text-sm">
                  {errors.characterName.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Difficulty</Label>
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
                      {DIFFICULTIES.map((d) => (
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

              {errors.difficulty && (
                <p className="text-destructive text-sm">
                  {errors.difficulty.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaythroughForm;
