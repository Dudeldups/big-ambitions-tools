"use client";

import { useAppStore } from "@/lib/stores/appStore";
import { useGameSaveStore } from "@/lib/stores/gameSaveStore";
import { useEffect } from "react";

export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
    useGameSaveStore.persist.rehydrate();
  }, []);

  return null;
}
