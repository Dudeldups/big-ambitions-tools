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
import { Spinner } from "@/components/ui/spinner";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { PlaythroughFormValues } from "@/lib/schemas/playthrough";
import {
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { SquareCheckBig, SquarePen, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import CreatePlaythroughForm from "./create-playthrough-form";
import DeletePlaythroughDialog from "./delete-playthrough-dialog";

const PlaythroughOverview = () => {
  const t = useTranslations();
  const playthroughs = usePlaythroughState((state) => state.playthroughs);

  const editPlaythrough = usePlaythroughStore((state) => state.editPlaythrough);
  const setActivePlaythrough = usePlaythroughStore(
    (state) => state.setActivePlaythrough,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingPlaythroughId, setEditingPlaythroughId] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<PlaythroughFormValues>();

  const startEditing = (pt: Playthrough) => {
    reset({ characterName: pt.characterName, difficulty: pt.difficulty });
    setEditingPlaythroughId(pt.id);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingPlaythroughId(null);
    reset();
  };

  const onSubmit = (values: PlaythroughFormValues) => {
    if (!editingPlaythroughId) return;

    if (isDirty) {
      const updatedPlaythrough = editPlaythrough(editingPlaythroughId, {
        characterName: values.characterName,
        difficulty: values.difficulty as (typeof DIFFICULTY_OPTIONS)[number],
      });
      if (updatedPlaythrough) {
        toast.success(
          t("toasts.playthroughEditSuccess", {
            characterName: updatedPlaythrough.characterName,
          }),
          { position: "bottom-right" },
        );
      }
    }
    setIsEditing(false);
    setEditingPlaythroughId(null);
  };

  return (
    <div>
      <hgroup>
        <h2>{t("tools.dashboard.title")}</h2>

        <p>{t("tools.dashboard.desc")}</p>
      </hgroup>

      <div className="flex items-center gap-5">
        <p>{t("tools.dashboard.createPlaythroughButtonDesc")}</p>
        <CreatePlaythroughForm />
      </div>

      <div>
        {!playthroughs ? (
          <Spinner />
        ) : playthroughs.length === 0 ? (
          <p>{t("tools.dashboard.noPlaythroughs")}</p>
        ) : (
          <ul className="flex flex-wrap gap-5">
            {playthroughs.map((pt) => (
              <li key={pt.id} className="bg-card rounded-md border p-4">
                {isEditing && editingPlaythroughId === pt.id ? (
                  <form
                    className="flex items-center gap-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col items-end">
                      <Input
                        className="mb-2 w-60"
                        {...register("characterName")}
                      />
                      <Controller
                        control={control}
                        name="difficulty"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                      <Button
                        size="icon-lg"
                        variant="destructive"
                        onClick={cancelEditing}
                      >
                        <X className="size-5" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-8">
                    <button
                      className="text-left"
                      onClick={() => setActivePlaythrough(pt.id)}
                    >
                      <hgroup>
                        <h3 className="w-60 truncate text-xl font-semibold">
                          {pt.characterName}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          {t("general.difficulty")}:{" "}
                          {t(`general.difficultyOptions.${pt.difficulty}`)}
                        </p>
                        <p className="text-muted-foreground">
                          {t("general.factories")}: {pt.factoryIds.length}
                        </p>
                      </hgroup>
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-lg"
                        variant="outline"
                        onClick={() => {
                          if (isEditing) {
                            cancelEditing();
                          } else {
                            startEditing(pt);
                          }
                        }}
                      >
                        <SquarePen className="size-5" />
                      </Button>
                      <DeletePlaythroughDialog playthroughToDelete={pt.id} />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaythroughOverview;
