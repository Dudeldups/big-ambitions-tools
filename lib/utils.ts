import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "max-w": ["max-w-page"],
      "font-size": [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-h5",
        "text-h6",
      ],
      px: ["px-clamp-x"],
      py: ["py-clamp-y"],
      "text-color": [
        "text-brand-secondary",
        "text-brand-secondary-foreground",
        "text-brand-secondary-light",
        "text-hero",
        "text-hero-foreground",
        "text-hero-accent",
      ],
      "bg-color": [
        "bg-brand-secondary",
        "bg-brand-secondary-foreground",
        "bg-brand-secondary-light",
        "bg-hero",
        "bg-hero-foreground",
        "bg-hero-accent",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
