"use client";

import { Spinner } from "@/components/ui/spinner";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { PlaythroughFormValues } from "@/lib/schemas/playthrough";
import {
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import CreatePlaythroughForm from "./create-playthrough-form";
import EditPlaythroughForm from "./edit-playthrough-form";
import PlaythroughInfoCard from "./playthrough-info-card";

const PlaythroughOverview = () => {
  const t = useTranslations();
  const playthroughs = usePlaythroughState((state) => state.playthroughs);

  const editPlaythrough = usePlaythroughStore((state) => state.editPlaythrough);

  const [editingPlaythroughId, setEditingPlaythroughId] = useState<
    string | null
  >(null);

  const form = useForm<PlaythroughFormValues>();
  const {
    reset,
    formState: { isDirty },
  } = form;

  const startEditing = (pt: Playthrough) => {
    reset({ characterName: pt.characterName, difficulty: pt.difficulty });
    setEditingPlaythroughId(pt.id);
  };

  const cancelEditing = () => {
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
                {editingPlaythroughId === pt.id ? (
                  <FormProvider key={pt.id} {...form}>
                    <EditPlaythroughForm
                      onSubmit={onSubmit}
                      cancelEditing={cancelEditing}
                    />
                  </FormProvider>
                ) : (
                  <PlaythroughInfoCard
                    pt={pt}
                    editingPlaythroughId={editingPlaythroughId}
                    cancelEditing={cancelEditing}
                    startEditing={startEditing}
                  />
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
