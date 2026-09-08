"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Upload, Database } from "lucide-react";
import { get, set, entries } from "idb-keyval";
import { toast } from "sonner";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function SettingsBackupDialog() {
  const t = useTranslations("settingsBackup");
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const allEntries = await entries();
      const backupData: Record<string, any> = {};

      for (const [key, value] of allEntries) {
        backupData[String(key)] = value;
      }

      if (!backupData["playthrough-storage"]) {
        const ptData = await get("playthrough-storage");
        if (ptData) {
          backupData["playthrough-storage"] = ptData;
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${new Date().toISOString().split("T")[0]}-big-ambitions-settings.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t("exportSuccess"));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("exportError"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const fileText = await file.text();
      const parsedData = JSON.parse(fileText);

      if (typeof parsedData !== "object" || parsedData === null) {
        throw new Error("Invalid format");
      }

      for (const [key, value] of Object.entries(parsedData)) {
        await set(key, value);
      }

      // Rehydrate store so current UI updates immediately
      await usePlaythroughStore.persist.rehydrate();

      toast.success(t("importSuccess"));
      setOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(t("importError"));
    } finally {
      setIsImporting(false);
      // Reset input value
      event.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title={t("dialogTriggerTitle")}>
          <Database className="size-4" />
          <span className="sr-only">{t("dialogTriggerSrOnly")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">{t("exportTitle")}</div>
              <div className="text-muted-foreground text-sm">
                {t("exportDescription")}
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="size-4" />
              {t("exportButton")}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">{t("importTitle")}</div>
              <div className="text-muted-foreground text-sm">
                {t("importDescription")}
              </div>
            </div>
            <label>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImport}
                disabled={isImporting}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isImporting}
                className="pointer-events-none flex items-center gap-2"
                asChild
              >
                <span>
                  <Upload className="size-4" />
                  {t("importButton")}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
