"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DIFFICULTIES } from "@/lib/constants";
import { useAppState } from "@/lib/hooks/useAppState";
import { GameSaveFormValues, gameSaveSchema } from "@/lib/schemas/gameSave";
import { useGameSaveStore } from "@/lib/stores/gameSaveStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateGameSaveForm = () => {
  const addGameSave = useGameSaveStore((state) => state.addGameSave);
  const appDifficulty = useAppState((state) => state.difficulty);

  const t = useTranslations();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GameSaveFormValues>({
    resolver: zodResolver(gameSaveSchema),
    mode: "onChange",
    defaultValues: {
      characterName: "",
      difficulty: appDifficulty ?? "easy",
    },
  });

  const onSubmit = (values: GameSaveFormValues) => {
    const save = addGameSave(values);
    toast.success(
      t("toasts.gameSaveSuccess", { characterName: save.characterName }),
      {
        position: "bottom-right",
      },
    );
    reset();
  };

  // TODO: make the form a modal with loading state for difficulty

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
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
      </div>

      <div className="space-y-2">
        <Label>Difficulty</Label>

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

        {errors.difficulty && (
          <p className="text-destructive text-sm">
            {errors.difficulty.message}
          </p>
        )}
      </div>

      <Button type="submit">Create Save</Button>
    </form>
  );
};

export default CreateGameSaveForm;
