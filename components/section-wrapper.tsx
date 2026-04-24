"use client";

import { glowVariants, revealVariants } from "@/lib/animations";
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

  return (
    <div
      className={cn(
        "section-wrapper",
        variant !== "default" && `hero--${variant}`,
        centerMobile && "center-mobile",
        className,
      )}
    >
      <AnimatePresence mode="sync">
        {variant !== "default" && (
          <motion.div
            key={variant}
            layoutId="hero-background-glow"
            layout="y"
            variants={glowVariants}
            initial={isMounted ? "hidden" : false}
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.4 }}
            className="hero-bg-div absolute inset-0 -z-10 overflow-hidden"
            style={{ willChange: "opacity, transform" }}
          />
        )}
      </AnimatePresence>

      <motion.section
        key={`content-${variant}`}
        variants={revealVariants}
        initial={isMounted ? "hidden" : false}
        animate="visible"
        style={{ willChange: "clip-path, opacity" }}
      >
        {children}
      </motion.section>
    </div>
  );
};

export default SectionWrapper;
