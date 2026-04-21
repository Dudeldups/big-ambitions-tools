"use client";

import { cn } from "@/lib/utils";
import Breadcrumbs from "./breadcrumbs";
import NavContent from "./nav-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";

const MobileHeader = () => {
  const isMobile = useBreakpoint("mobile");
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);
  const threshold = 50;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 50) {
      setHidden(false);
      lastScrollY.current = latest;
      return;
    }

    const diff = latest - lastScrollY.current;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && !hidden) {
        setHidden(true);
      } else if (diff < 0 && hidden) {
        setHidden(false);
      }

      lastScrollY.current = latest;
    }
  });

  if (!isMobile) return null;

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-110%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "sticky -top-1 z-50 flex items-center justify-between gap-3 p-3",
        "border-foreground/10 shadow-foreground/5 border shadow-md",
        "bg-background/20 saturate-150 backdrop-blur-md",
        "from-accent/20 via-muted dark:via-muted/50 to-accent/20 bg-linear-150",
      )}
    >
      <Breadcrumbs
        className={cn(
          "max-w-page bg-secondary flex items-center rounded-lg px-4 py-3",
        )}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            className="bg-secondary border shadow-sm backdrop-blur-md md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className={cn(
            "flex flex-col p-4 sm:p-8",
            "from-popover via-muted-foreground/20 dark:via-sidebar-accent/20 to-popover bg-linear-to-b data-[side=right]:w-10/12",
          )}
        >
          <SheetTitle className="text-left text-2xl">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigation</SheetDescription>
          <div className="mt-4 flex w-full flex-1 flex-col items-end justify-between gap-8">
            <NavContent onAction={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
};

export default MobileHeader;
