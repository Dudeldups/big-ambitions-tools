"use client";

import SectionWrapper from "@/components/deco/section-wrapper";
import TableSwitcher from "@/components/tables/table-switcher";
import { usePathname } from "@/i18n/navigation";
import { fadeIn, withMotion } from "@/lib/animations";
import {
  getGameVersionLabel,
  SELECTABLE_GAME_VERSIONS,
} from "@/lib/game/versions";
import { useAppState } from "@/lib/hooks/useAppState";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { useAppStore } from "@/lib/stores/appStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import TextSkeleton from "@/components/cemetery/text-skeleton";

const DatabaseLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("database");
  const tGeneral = useTranslations("general");
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const gameVersion = useAppState((state) => state.gameVersion);
  const setGameVersion = useAppStore((state) => state.setGameVersion);

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
        <div className="flex flex-col flex-wrap items-center gap-6 md:flex-row md:justify-between">
          <TableSwitcher />

          <div className="flex max-w-xs flex-col items-end gap-0.5 space-y-2">
            <Label htmlFor="db-game-version">{tGeneral("gameVersion")}</Label>
            {gameVersion ? (
              <Select value={gameVersion} onValueChange={setGameVersion}>
                <SelectTrigger id="db-game-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {SELECTABLE_GAME_VERSIONS.map((version) => (
                      <SelectItem key={version} value={version}>
                        {getGameVersionLabel(version)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <div className="border-input bg-background flex h-9 items-center rounded-md border px-3">
                <TextSkeleton className="w-16" />
              </div>
            )}
          </div>
        </div>

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
