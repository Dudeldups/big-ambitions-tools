"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { cn } from "@/lib/utils";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";

type BreadcrumbsProps = {
  className?: string;
};

const Breadcrumbs = ({ className }: BreadcrumbsProps) => {
  const hasHydrated = useHasHydrated();
  const pathname = usePathname();
  const t = useTranslations("breadcrumbs");

  const getPlaythroughById = usePlaythroughStore((s) => s.getPlaythroughById);
  const getFactoryById = usePlaythroughStore((s) => s.getFactoryById);

  if (!hasHydrated) {
    return <div className="h-10" />;
  }

  const rawSegments = pathname.split("/").filter(Boolean);
  const validBreadcrumbs: { href: string; label: string }[] = [];

  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i];
    const parentSegment = rawSegments[i - 1];
    const href = `/${rawSegments.slice(0, i + 1).join("/")}`;

    let label: string | undefined;

    if (parentSegment === "tools") {
      label = getPlaythroughById(segment)?.characterName;
    } else if (parentSegment === "factories") {
      label = getFactoryById(segment)?.name;
    } else {
      label = t.has(segment) ? t(segment) : segment;
    }

    if (
      !label &&
      (parentSegment === "tools" || parentSegment === "factories")
    ) {
      break;
    }

    validBreadcrumbs.push({ href, label: label || segment });
  }

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{t("home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {validBreadcrumbs.map((crumb, index) => {
          const isLast = index === validBreadcrumbs.length - 1;

          return (
            <Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="truncate max-md:max-w-[15ch]">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.href}
                      className="truncate max-md:max-w-[15ch]"
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
