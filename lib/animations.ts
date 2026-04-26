import { Variants } from "framer-motion";

type MotionPreset = {
  variants: Variants;
  willChange?: string;
};

export const withMotion = (preset: MotionPreset) => ({
  variants: preset.variants,
  style: preset.willChange ? { willChange: preset.willChange } : undefined,
});

/**
 * Soft reveal from top to bottom using clip-path
 */
export const revealClipPath: MotionPreset = {
  variants: {
    hidden: {
      opacity: 0,
      clipPath: "inset(0% 0% 100% 0%)",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },
  willChange: "clipPath, opacity",
};

/**
 * Standard fade in animation using opacity
 */
export const fadeIn: MotionPreset = {
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  willChange: "opacity",
};

/**
 * Only used for hero bg
 */
export const heroGlow: MotionPreset = {
  variants: {
    hidden: { opacity: 0.7 },
    visible: {
      opacity: 1,
      transition: { type: "tween", duration: 0.4, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  },
  willChange: "opacity",
};
