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
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type DeletePlaythroughDialogProps = {
  playthroughToDelete: string;
};

const DeletePlaythroughDialog = ({
  playthroughToDelete,
}: DeletePlaythroughDialogProps) => {
  const deletePlaythrough = usePlaythroughStore(
    (state) => state.deletePlaythrough,
  );

  const t = useTranslations();

  const onDelete = () => {
    const deleted = deletePlaythrough(playthroughToDelete);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-lg" variant="destructive">
          <Trash2 className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("tools.dashboard.deletePlaythroughTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("tools.dashboard.deletePlaythroughDesc")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("general.cancel")}</Button>
          </DialogClose>
          <Button type="submit" onClick={() => onDelete()}>
            {t("general.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePlaythroughDialog;
