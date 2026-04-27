"use client";

import { fadeIn, heroGlow, revealClipPath, withMotion } from "@/lib/animations";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "default";
  size?: "default" | "compact";
  className?: string;
  centerMobile?: boolean;
}

const SectionWrapper = ({
  children,
  variant = "default",
  size = "default",
  className,
  centerMobile = true,
}: SectionWrapperProps) => {
  const isMounted = useIsMounted();
  const sectionMotionPreset = variant === "default" ? fadeIn : revealClipPath;

  const sizeClasses = {
    default: "pt-36 md:pt-52",
    compact: "pt-20 md:pt-32 pb-12",
  };

  return (
    <div
      className={cn(
        "section-wrapper px-clamp-x py-clamp-y @container/section relative",
        variant !== "default" && [
          `hero--${variant} text-(--color-hero-foreground) max-md:-mt-16`,
          sizeClasses[size],
        ],
      )}
    >
      <AnimatePresence mode="sync">
        {variant !== "default" && (
          <motion.div
            key={variant}
            layoutId="hero-background-glow"
            layout="y"
            {...withMotion(heroGlow)}
            initial={isMounted ? "hidden" : false}
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.4 }}
            className="hero-bg-div absolute inset-0 -z-10"
          />
        )}
      </AnimatePresence>

      <motion.section
        key={`content-${variant}`}
        {...withMotion(sectionMotionPreset)}
        initial={isMounted ? "hidden" : false}
        animate="visible"
        className={cn(
          "max-w-page mx-auto flex flex-col gap-6",
          centerMobile && "center-mobile max-md:items-center",
          className,
        )}
      >
        {children}
      </motion.section>
    </div>
  );
};

export default SectionWrapper;
