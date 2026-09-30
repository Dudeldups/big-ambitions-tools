"use client";

import { SmartLink } from "@/components/smart-link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { DATABASE_DETAIL_CONFIG, DetailKind } from "./database-detail-config";

const DatabaseDetailPage = ({
  kind,
  children,
}: {
  kind: DetailKind;
  children: React.ReactNode;
}) => {
  const t = useTranslations("database.details");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <SmartLink
        href={DATABASE_DETAIL_CONFIG[kind].overview}
        className="focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
        <span>{t("backToOverview")}</span>
      </SmartLink>
      {children}
    </div>
  );
};

export default DatabaseDetailPage;
