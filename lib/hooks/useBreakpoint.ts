"use client";

import { useSyncExternalStore } from "react";

const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
};

const queries = {
  mobile: `(width < ${breakpoints.md})`,
  mdToLg: `(width >= ${breakpoints.md}) and (width < ${breakpoints.lg})`,
  mdToXl: `(width >= ${breakpoints.md}) and (width < ${breakpoints.xl})`,
  lgAndUp: `(width >= ${breakpoints.lg})`,
  xlAndUp: `(width >= ${breakpoints.xl})`,
  "2xlAndUp": `(width >= ${breakpoints["2xl"]})`,
};

export function useBreakpoint(key: keyof typeof queries) {
  const query = queries[key];

  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
