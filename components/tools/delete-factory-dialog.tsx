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

type DeleteFactoryDialogProps = {
  factoryToDelete: string;
  playthroughId: string;
};

const DeleteFactoryDialog = ({
  factoryToDelete,
  playthroughId,
}: DeleteFactoryDialogProps) => {
  const deleteFactory = usePlaythroughStore((state) => state.deleteFactory);

  const t = useTranslations();

  const onDelete = () => {
    const deleted = deleteFactory(factoryToDelete, playthroughId);
    if (deleted) {
      toast.success(
        t("toasts.factoryDeleteSuccess", {
          factoryName: deleted.name,
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
        <Button size="icon-lg" variant="destructive" className="relative z-20">
          <Trash2 className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tools.factoryForm.deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("tools.factoryForm.deleteDesc")}
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

export default DeleteFactoryDialog;
