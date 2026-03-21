"use client";

import { Button } from "@/components/ui/button";
import {
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import DeletePlaythroughDialog from "./delete-playthrough-dialog";

type PlaythroughInfoCardProps = {
  pt: Playthrough;
  editingPlaythroughId: string | null;
  cancelEditing: () => void;
  startEditing: (playthrough: Playthrough) => void;
};

const PlaythroughInfoCard = ({
  pt,
  editingPlaythroughId,
  cancelEditing,
  startEditing,
}: PlaythroughInfoCardProps) => {
  const t = useTranslations();
  const setActivePlaythrough = usePlaythroughStore(
    (state) => state.setActivePlaythrough,
  );

  return (
    <div className="flex items-center gap-8">
      <button className="text-left" onClick={() => setActivePlaythrough(pt.id)}>
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
            if (editingPlaythroughId) {
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
  );
};

export default PlaythroughInfoCard;
