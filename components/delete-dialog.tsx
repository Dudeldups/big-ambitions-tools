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
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type DeleteDialogProps = {
  className?: string;
  onDelete: () => void;
  title: string;
  description: string;
  buttonText?: string;
};

const DeleteDialog = ({
  className,
  onDelete,
  title,
  description,
  buttonText,
}: DeleteDialogProps) => {
  const t = useTranslations("general");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={buttonText ? "default" : "icon-lg"}
          variant="destructive"
          className={cn(className)}
          aria-label={t("delete")}
        >
          <Trash2 className="size-5" />
          {buttonText && buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={() => onDelete()}>
              {t("confirm")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
