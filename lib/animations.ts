import { Variants } from "framer-motion";

/**
 * Soft reveal from top to bottom using clip-path
 */
export const revealVariants: Variants = {
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
};

/**
 * Standard fade in animation using opacity
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Only used for hero bg
 */
export const glowVariants: Variants = {
  hidden: { opacity: 0.7 },
  visible: {
    opacity: 1,
    transition: { type: "tween", duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};
