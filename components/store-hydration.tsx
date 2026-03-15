"use client";

import { useAppStore } from "@/lib/store/appStore";
import { useEffect } from "react";

export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  return null;
}
