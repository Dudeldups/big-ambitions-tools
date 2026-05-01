"use client";

import SectionWrapper from "@/components/deco/section-wrapper";
import TableSwitcher from "@/components/tables/table-switcher";
import { usePathname } from "@/i18n/navigation";
import { fadeIn, withMotion } from "@/lib/animations";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const DatabaseLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");
  const tGeneral = useTranslations("general");
  const isMounted = useIsMounted();
  const pathname = usePathname();

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <hgroup className="grid items-end gap-14 md:grid-cols-[2fr_3fr] lg:gap-24">
          <h1>{tGeneral("database")}</h1>

          <div className="max-w-lg">
            <p className="text-h5">{t("intro.desc")}</p>
          </div>
        </hgroup>
      </SectionWrapper>

      <SectionWrapper className="block space-y-18">
        <TableSwitcher />

        <motion.div
          key={`content-${pathname}`}
          {...withMotion(fadeIn)}
          initial={isMounted ? "hidden" : false}
          animate="visible"
          className="space-y-12"
        >
          {children}
        </motion.div>
      </SectionWrapper>
    </div>
  );
};

export default DatabaseLayoutClient;
