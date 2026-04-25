import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { updateHistory } from "@/lib/updateHistory";
import { sLink } from "@/i18n/defaults";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import SectionWrapper from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  DatabaseSearch,
  ExternalLink,
  PencilRuler,
} from "lucide-react";
import { SmartLink } from "@/components/smart-link";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const tUpdates = useTranslations("updateHistory");
  const { t: tHome, rich } = useRichDefaults("home");

  const format = useFormatter();
  const dateFormattingRules: DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="primary" centerMobile>
        <hgroup className="grid items-start gap-14 max-md:max-w-lg md:grid-cols-[3fr_2fr] md:gap-y-24 xl:grid-cols-2">
          <h1 className="home-h1">Big Ambitions Tools</h1>

          <div className="hero-icon-container relative flex items-center justify-center gap-3 self-stretch md:row-span-2 md:flex-col @sm:gap-6 @lg:gap-10">
            <span className="bg-hero-foreground border-accent flex items-center justify-center rounded-full border p-2 sm:p-4">
              <Calculator className="text-hero-accent size-10 sm:size-14" />
            </span>
            <span className="bg-hero-foreground border-accent flex items-center justify-center rounded-full border p-2 sm:p-4">
              <DatabaseSearch className="text-hero-accent size-10 sm:size-14" />
            </span>
            <span className="bg-hero-foreground border-accent flex items-center justify-center rounded-full border p-2 sm:p-4">
              <PencilRuler className="text-hero-accent size-10 sm:size-14" />
            </span>
          </div>

          <p className="max-w-2xl self-end text-lg">{rich("intro.desc")}</p>
        </hgroup>

        <Separator className="bg-hero-foreground/70 mx-auto my-14 max-md:max-w-9/12 md:my-20" />

        <div className="max-w-md space-y-6">
          <p>{tHome("intro.gameDesc")}</p>
          <p>
            {rich("intro.gameDesc2", {
              website: (chunks) => (
                <Button asChild variant="foreground">
                  <SmartLink href="https://www.bigambitionsgame.com/">
                    {chunks}
                    <ExternalLink />
                  </SmartLink>
                </Button>
              ),
              link: (chunks) => (
                <Button asChild variant="foreground">
                  <SmartLink href="https://store.steampowered.com/app/1331550/Big_Ambitions/">
                    {chunks}
                    <ExternalLink />
                  </SmartLink>
                </Button>
              ),
            })}
          </p>

          <p>
            {rich("intro.errorDesc", {
              contact: (chunks) => (
                <SmartLink
                  href="/contact"
                  className="text-background font-semibold underline-offset-4 hover:underline"
                >
                  {chunks}
                </SmartLink>
              ),
            })}
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2>{tHome("cta.title")}</h2>
        <p>
          {rich("cta.desc", {
            link: sLink("/database"),
          })}
        </p>
        <p>
          {rich("cta.desc2", {
            link: sLink("/tools"),
          })}
        </p>
      </SectionWrapper>

      <SectionWrapper>
        <h2>{tHome("updates.title")}</h2>
        <ul>
          {updateHistory
            .slice()
            .reverse()
            .map((update, index) => (
              <li key={`update-${index}`}>
                <time dateTime={update.date}>
                  {format.dateTime(new Date(update.date), dateFormattingRules)}
                </time>{" "}
                - {tUpdates(update.id)}
              </li>
            ))}
        </ul>
      </SectionWrapper>
    </div>
  );
}
