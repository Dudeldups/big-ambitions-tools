"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";
import {
  getGameVersionLabel,
  SELECTABLE_GAME_VERSIONS,
} from "@/lib/game/versions";
import { PlaythroughFormValues } from "@/lib/schemas/playthrough";
import { SquareCheckBig, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";

type EditPlaythroughFormProps = {
  onSubmit: (values: PlaythroughFormValues) => void;
  cancelEditing: () => void;
};

const EditPlaythroughForm = ({
  onSubmit,
  cancelEditing,
}: EditPlaythroughFormProps) => {
  const tGeneral = useTranslations("general");
  const { register, handleSubmit, control } =
    useFormContext<PlaythroughFormValues>();

  return (
    <form
      className="bg-card flex w-full items-center justify-between gap-4 rounded-md border p-4 max-sm:flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-between gap-3">
        <Input {...register("characterName")} />
        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {tGeneral(`difficultyOptions.${opt}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="gameVersion"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SELECTABLE_GAME_VERSIONS.map((version) => (
                    <SelectItem key={version} value={version}>
                      {getGameVersionLabel(version)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex items-center gap-3 sm:flex-col">
        <Button
          size="icon-lg"
          variant="outline"
          type="submit"
          aria-label={tGeneral("confirm")}
        >
          <SquareCheckBig className="size-5" />
        </Button>
        <Button
          size="icon-lg"
          variant="destructive"
          onClick={cancelEditing}
          aria-label={tGeneral("cancel")}
        >
          <X className="size-5" />
        </Button>
      </div>
    </form>
  );
};

export default EditPlaythroughForm;
