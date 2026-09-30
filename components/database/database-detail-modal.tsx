"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { DATABASE_DETAIL_CONFIG, DetailKind } from "./database-detail-config";
import { useDatabaseModalFocus } from "./database-modal-focus-provider";

const DatabaseDetailModal = ({
  kind,
  itemName,
  children,
}: {
  kind: DetailKind;
  itemName: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const modalFocus = useDatabaseModalFocus();
  const contentRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const previousItemRef = useRef(`${kind}:${itemName}`);
  const translatedName = t(
    `${DATABASE_DETAIL_CONFIG[kind].namespace}.${itemName}`,
  );

  useEffect(() => {
    const currentItem = `${kind}:${itemName}`;
    if (previousItemRef.current === currentItem) return;
    previousItemRef.current = currentItem;
    const content = contentRef.current;
    if (!content) return;
    content.scrollTop = 0;
    content
      .querySelector<HTMLElement>("[data-database-detail-title]")
      ?.focus({ preventScroll: true });
  }, [kind, itemName]);

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent
        ref={contentRef}
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-x-hidden overflow-y-auto p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl"
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current = document.activeElement as HTMLElement | null;
          modalFocus?.remember(returnFocusRef.current);
          contentRef.current
            ?.querySelector<HTMLElement>("[data-database-detail-title]")
            ?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => {
          if (modalFocus) {
            event.preventDefault();
            modalFocus.restore();
            return;
          }
          if (returnFocusRef.current?.isConnected) {
            event.preventDefault();
            returnFocusRef.current.focus({ preventScroll: true });
          }
        }}
      >
        <DialogDescription className="sr-only">
          {t("database.details.dialogDescription", { name: translatedName })}
        </DialogDescription>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("general.close")}
            className="absolute top-3 right-3 z-10"
          >
            <X aria-hidden="true" />
            <span className="sr-only">{t("general.close")}</span>
          </Button>
        </DialogClose>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseDetailModal;
