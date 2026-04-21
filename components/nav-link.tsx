"use client";

import { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function NavLink({
  href,
  children,
  ...rest
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(String(href));

  return (
    <Button
      asChild
      variant={isActive ? "default" : "link"}
      className={cn(
        "text-foreground relative isolate hover:no-underline",
        isActive &&
          "text-primary-foreground bg-transparent hover:bg-transparent!",
        !isActive && "hover:text-primary dark:hover:text-primary-light",
      )}
    >
      <Link aria-current={isActive ? "page" : undefined} href={href} {...rest}>
        <span className="relative z-10">{children}</span>

        {isActive && (
          <motion.span
            layoutId="nav-link-bg"
            className="bg-primary absolute inset-0 rounded-md"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </Button>
  );
}
