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
  const tGeneral = useTranslations("general");
  const tTools = useTranslations("tools");
  const tToasts = useTranslations("toasts");
  const deletePlaythrough = usePlaythroughStore(
    (state) => state.deletePlaythrough,
  );

  const onDelete = () => {
    const deleted = deletePlaythrough(pt.id);
    if (deleted) {
      toast.success(
        tToasts("playthroughDeleteSuccess", {
          characterName: deleted.characterName,
        }),
        {
          position: "bottom-right",
        },
      );
    }
  };

  return (
    <div className="bg-card flex w-full items-center justify-between gap-4 rounded-md border max-sm:flex-col">
      <Link
        className="w-full min-w-0 flex-1 p-4 text-left"
        href={`/tools/${pt.id}`}
      >
        <dl>
          <dt className="text-h5 font-semibold sm:truncate">
            {pt.characterName}
          </dt>
          <dd className="text-muted-foreground mt-2">
            {tGeneral("difficulty")}:{" "}
            {tGeneral(`difficultyOptions.${pt.difficulty}`)}
          </dd>
          <dd className="text-muted-foreground">
            {tGeneral("factories")}: {pt.factoryIds.length}
          </dd>
        </dl>
      </Link>

      <div className="mr-4 flex shrink-0 justify-between gap-3 pb-4 sm:flex-col sm:pt-4">
        <Button
          size="icon-lg"
          variant="outline"
          aria-label={tGeneral("edit")}
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
          title={tTools("playthroughForm.deleteTitle")}
          description={tTools("playthroughForm.deleteDesc")}
        />
      </div>
    </div>
  );
};

export default PlaythroughInfoCard;
