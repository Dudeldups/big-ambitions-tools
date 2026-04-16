"use client";

import { Button } from "@/components/ui/button";
import {
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import DeleteDialog from "../delete-dialog";

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
  const deletePlaythrough = usePlaythroughStore(
    (state) => state.deletePlaythrough,
  );

  const onDelete = () => {
    const deleted = deletePlaythrough(pt.id);
    if (deleted) {
      toast.success(
        t("toasts.playthroughDeleteSuccess", {
          characterName: deleted.characterName,
        }),
        {
          position: "bottom-right",
        },
      );
    }
  };

  return (
    <div className="bg-card flex items-center rounded-md border">
      <Link className="p-4 text-left" href={`/tools/${pt.id}`}>
        <dl>
          <dt className="w-60 truncate text-xl font-semibold">
            {pt.characterName}
          </dt>
          <dd className="text-muted-foreground mt-2">
            {t("general.difficulty")}:{" "}
            {t(`general.difficultyOptions.${pt.difficulty}`)}
          </dd>
          <dd className="text-muted-foreground">
            {t("general.factories")}: {pt.factoryIds.length}
          </dd>
        </dl>
      </Link>

      <div className="mx-4 flex items-center gap-2">
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

        <DeleteDialog
          onDelete={onDelete}
          title={t("tools.playthroughForm.deleteTitle")}
          description={t("tools.playthroughForm.deleteDesc")}
        />
      </div>
    </div>
  );
};

export default PlaythroughInfoCard;
