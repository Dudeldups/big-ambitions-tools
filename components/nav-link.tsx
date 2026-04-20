"use client";

import { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function NavLink({
  href,
  ...rest
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(String(href));

  return (
    <Button
      asChild
      className={cn(
        "bg-muted/80 text-foreground border-border hover:bg-accent-foreground! hover:text-background border",
        isActive && "bg-foreground/90 text-background",
      )}
    >
      <Link
        aria-current={isActive ? "page" : undefined}
        href={href}
        {...rest}
      />
    </Button>
  );
}
