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
  const t = useTranslations();
  const { register, handleSubmit, control } =
    useFormContext<PlaythroughFormValues>();

  return (
    <form className="flex items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-end">
        <Input className="mb-2 w-60" {...register("characterName")} />
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
                      {t(`general.difficultyOptions.${opt}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon-lg" variant="outline" type="submit">
          <SquareCheckBig className="size-5" />
        </Button>
        <Button size="icon-lg" variant="destructive" onClick={cancelEditing}>
          <X className="size-5" />
        </Button>
      </div>
    </form>
  );
};

export default EditPlaythroughForm;
