"use client";

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
import EditPlaythroughForm from "./edit-playthrough-form";
import PlaythroughInfoCard from "./playthrough-info-card";
import CenteredSpinner from "../cemetery/centered-spinner";
import NoDataFound from "../no-data-found";

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
    <div className="">
      {!playthroughs ? (
        <CenteredSpinner />
      ) : playthroughs.length === 0 ? (
        <NoDataFound text={t("tools.playthroughs.noPlaythroughs")} />
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
          {playthroughs.map((pt) => (
            <li key={pt.id} className="flex">
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
  );
};

export default PlaythroughOverview;
