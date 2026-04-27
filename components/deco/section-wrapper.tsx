"use client";

import { fadeIn, heroGlow, revealClipPath, withMotion } from "@/lib/animations";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "default";
  className?: string;
  centerMobile?: boolean;
}

const SectionWrapper = ({
  children,
  variant = "default",
  className,
  centerMobile = true,
}: SectionWrapperProps) => {
  const isMounted = useIsMounted();
  const sectionMotionPreset = variant === "default" ? fadeIn : revealClipPath;

  return (
    <div
      className={cn(
        "section-wrapper px-clamp-x py-clamp-y @container/section relative",
        variant !== "default" &&
          `hero--${variant} pt-36 text-(--color-hero-foreground) max-md:-mt-16 md:pt-60`,
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
