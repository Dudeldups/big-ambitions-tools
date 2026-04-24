"use client";

import { cn } from "@/lib/utils";
import Breadcrumbs from "./breadcrumbs";
import NavContent from "./nav-content";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import MobileHeader from "./mobile-header";

const PageHeader = () => {
  const isMobile = useBreakpoint("mobile");
  const isgreaterThanMobile = useBreakpoint("mdAndUp");

  if (isMobile) {
    return <MobileHeader />;
  } else if (isgreaterThanMobile) {
    return <DesktopHeader />;
  } else {
    return (
      <>
        <MobileHeader />
        <DesktopHeader />
      </>
    );
  }
};

export default PageHeader;

function DesktopHeader() {
  return (
    <header
      className={cn(
        "hidden md:flex",
        "px-clamp-x absolute inset-x-0 top-0 z-40 flex-col items-center pt-4",
      )}
    >
      <div
        className={cn(
          "flex",
          "max-w-page w-full items-center justify-between rounded-lg px-4 py-3",
          "border-foreground/10 border",
          "bg-background/20 saturate-150 backdrop-blur-md",
          "from-muted/90 via-accent/70 dark:via-accent/50 dark:from-muted/70 dark:to-muted/70 to-muted/90 bg-linear-150",
        )}
      >
        <NavContent />
      </div>

      <Breadcrumbs
        className={cn("max-w-page flex w-full items-center py-3 md:px-4")}
      />
    </header>
  );
}
