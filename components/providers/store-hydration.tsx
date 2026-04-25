"use client";

import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useEffect } from "react";

export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
    usePlaythroughStore.persist.rehydrate();
  }, []);

  return null;
}
