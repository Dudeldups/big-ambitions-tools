"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Upload, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import {
  exportSettingsBackup,
  importSettingsBackup,
} from "@/lib/utils/settingsBackup";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type SettingsBackupDialogProps = {
  triggerLabel?: string;
};

export function SettingsBackupDialog({
  triggerLabel,
}: SettingsBackupDialogProps = {}) {
  const t = useTranslations("settingsBackup");
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const appHydrated = useAppStore((s) => s._hasHydrated);
  const playthroughHydrated = usePlaythroughStore((s) => s._hasHydrated);
  const busy = isExporting || isImporting;

  const handleExport = () => {
    if (busy) return;
    setIsExporting(true);
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      const blob = new Blob([exportSettingsBackup()], {
        type: "application/json",
      });
      url = URL.createObjectURL(blob);
      link = document.createElement("a");
      link.href = url;
      link.download = `${new Date().toISOString().split("T")[0]}-big-ambitions-settings.json`;
      document.body.appendChild(link);
      link.click();
      toast.success(t("exportSuccess"));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("exportError"));
    } finally {
      link?.remove();
      if (url) URL.revokeObjectURL(url);
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || busy) return;
    setIsImporting(true);
    try {
      await importSettingsBackup(await file.text());
      toast.success(t("importSuccess"));
      setOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(t("importError"));
    } finally {
      setIsImporting(false);
      input.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!busy) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={triggerLabel ? "default" : "icon"}
          title={t("dialogTriggerTitle")}
          disabled={!appHydrated || !playthroughHydrated}
        >
          <ArchiveRestore className="size-4" />
          {triggerLabel ?? (
            <span className="sr-only">{t("dialogTriggerSrOnly")}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">{t("exportTitle")}</div>
              <div className="text-muted-foreground text-sm">
                {t("exportDescription")}
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={busy}
              className="flex items-center gap-2"
            >
              <Download className="size-4" />
              {t("exportButton")}
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">{t("importTitle")}</div>
              <div className="text-muted-foreground text-sm">
                {t("importDescription")}
              </div>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              className="hidden"
              aria-label={t("importTitle")}
              onChange={handleImport}
              disabled={busy}
            />
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="size-4" />
              {t("importButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
