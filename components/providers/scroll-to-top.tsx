"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

export const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
