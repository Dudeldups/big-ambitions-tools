import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { updateHistory } from "@/lib/updateHistory";
import { sLink } from "@/i18n/defaults";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import SectionWrapper from "@/components/deco/section-wrapper";
import {
  Calculator,
  Database,
  DatabaseSearch,
  ExternalLink,
  History,
  MessageSquareMore,
  PencilRuler,
  Rocket,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { SmartLink } from "@/components/smart-link";
import { Button } from "@/components/ui/button";
import ImageCircleBg from "@/components/deco/image-circle-bg";
import { cn } from "@/lib/utils";
import SectionSeparator from "@/components/deco/section-separator";
import { GLOSSARY } from "@/i18n/glossary";

const heroIcons = [
  { Icon: Calculator, id: "calc" },
  { Icon: DatabaseSearch, id: "db" },
  { Icon: PencilRuler, id: "ruler" },
];

const getQuoteIndexForDay = (quoteCount: number) => {
  const today = new Date();
  const utcDayKey = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );

  return Math.floor(utcDayKey / 86_400_000) % quoteCount;
};

export default function Home() {
  const tUpdates = useTranslations("updateHistory");
  const { t: tHome, rich } = useRichDefaults("home");
  const quoteOfTheDay = {
    title: tHome("quoteOfTheDay.title"),
    quotes: tHome.raw("quoteOfTheDay.quotes") as string[],
  };
  const dailyQuote =
    quoteOfTheDay.quotes[getQuoteIndexForDay(quoteOfTheDay.quotes.length)];

  const format = useFormatter();
  const dateFormattingRules: DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return (
    <div className="main-wrapper">
      <SectionWrapper
        variant="primary"
        centerMobile
        className="gap-20 md:gap-32"
      >
        {/* Main hero section */}
        <hgroup className="grid items-start gap-14 max-md:max-w-lg md:grid-cols-[3fr_2fr] md:gap-y-24 xl:grid-cols-2">
          <h1 className="home-h1">{GLOSSARY.siteName}</h1>

          <div className="hero-icon-container relative flex items-center justify-center gap-3 self-stretch sm:gap-10 md:row-span-2 md:flex-col @sm:gap-6">
            {heroIcons.map(({ Icon, id }) => (
              <ImageCircleBg
                key={id}
                size="md"
                className="border-2 border-black bg-transparent lg:p-5 lg:*:size-12"
              >
                <Icon className="text-hero-foreground" />
              </ImageCircleBg>
            ))}
          </div>

          <p className="text-h5 mt-4 max-w-2xl self-end text-pretty">
            {rich("intro.desc")}
          </p>
        </hgroup>
      </SectionWrapper>

      <SectionWrapper centerMobile className="max-w-4xl gap-8">
        {/* Quote of the day */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2>{quoteOfTheDay.title}</h2>
        </div>

        <div className="via-popover-foreground/90 p-clamp-x card--quote from-popover-foreground/80 to-popover-foreground/80 ring-muted-foreground mx-auto w-full max-w-3xl rounded-xl bg-linear-170">
          <blockquote className="text-h5 text-card leading-relaxed text-pretty max-lg:text-center">
            {dailyQuote}
          </blockquote>
        </div>
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="max-w-5xl max-lg:items-center max-lg:gap-14 lg:flex-row lg:justify-between">
        {/* CTA */}
        <div className="flex flex-col items-center gap-8 lg:items-start lg:gap-14">
          <h2>{tHome("cta.title")}</h2>

          <ImageCircleBg
            variant="primary"
            size="xl"
            className="border-primary shadow-muted-foreground/30 dark:shadow-foreground/50 border-3 shadow-[0_0_15px_rgba(0,0,0,0.2)] md:border-4 md:p-7 md:*:size-20"
          >
            <Rocket />
          </ImageCircleBg>
        </div>

        <div className="p-clamp-x border-border bg-popover shadow-accent grid max-w-lg gap-10 rounded-xl border shadow-md sm:max-w-xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <ImageCircleBg variant="foregroundInverted" size="md">
              <Database />
            </ImageCircleBg>
            <p>
              {rich("cta.desc", {
                link: sLink("/database"),
              })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <ImageCircleBg variant="foregroundInverted" size="md">
              <Calculator />
            </ImageCircleBg>

            <p>
              {rich("cta.desc2", {
                link: sLink("/tools"),
              })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <ImageCircleBg variant="foregroundInverted" size="md">
              <MessageSquareMore />
            </ImageCircleBg>

            <p>
              {rich("cta.errorDesc", {
                contact: sLink("/contact"),
              })}
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper
        centerMobile
        className="gap-16 md:gap-32 lg:flex-row lg:gap-0 lg:*:flex-1"
      >
        {/* Game description */}
        <div className="flex flex-col gap-10 max-lg:items-center lg:gap-14">
          <hgroup className="relative max-lg:text-center">
            <h2>{tHome("game.title")}</h2>
            <em className="text-h3 text-muted-foreground my-4 block font-semibold italic underline underline-offset-4">
              {tHome("game.subtitle")}
            </em>
          </hgroup>

          <div className="via-popover-foreground/90 p-clamp-x card--quote from-popover-foreground/80 to-popover-foreground/80 ring-muted-foreground max-w-xl rounded-xl bg-linear-170 md:mx-6">
            <blockquote className="text-h5 text-card leading-relaxed text-pretty max-lg:text-center">
              {rich("game.desc")}
            </blockquote>
          </div>
        </div>

        {/* Official links */}
        <div className="flex flex-col items-center gap-14 *:flex-1">
          <div className="border-border dark:bg-popover/40 bg-popover shadow-accent flex w-full max-w-88 flex-col items-center gap-6 rounded-xl border-2 p-4 text-center shadow-sm">
            <Image
              src="/assets/logos/logo_steam.webp"
              alt="steam logo"
              width={64}
              height={64}
              className="mx-auto rounded-lg sm:size-20"
            />
            <p className="flex flex-col items-center gap-3">
              {rich("game.steam", {
                link: (chunks) => (
                  <Button asChild variant="secondary" className="font-semibold">
                    <SmartLink href="https://store.steampowered.com/app/1331550/Big_Ambitions/">
                      {chunks}
                      <ExternalLink />
                    </SmartLink>
                  </Button>
                ),
              })}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Image
              src="/assets/logos/logo-big-ambitions.png"
              alt=""
              width={231}
              height={115}
              className="mx-auto aspect-[2.013]"
            />
          </div>
          <div className="border-border dark:bg-popover/40 bg-popover shadow-accent flex w-full max-w-88 flex-col items-center gap-6 rounded-xl border-2 p-4 text-center shadow-sm">
            <Image
              src="/assets/logos/logo_hovgaard_windmill.webp"
              alt="hovgaard logo"
              width={64}
              height={64}
              className="mx-auto rounded-lg sm:size-20"
            />
            <p className="flex flex-col items-center gap-3">
              {rich("game.hovgaard", {
                website: (chunks) => (
                  <Button asChild variant="secondary" className="font-semibold">
                    <SmartLink href="https://www.bigambitionsgame.com/">
                      {chunks}
                      <ExternalLink />
                    </SmartLink>
                  </Button>
                ),
              })}
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionSeparator />

      <SectionWrapper className="max-w-5xl gap-10 max-lg:items-center lg:flex-row lg:gap-18">
        {/* Latest updates */}
        <div className="flex flex-col items-center gap-8 lg:flex-col-reverse lg:gap-12">
          <ImageCircleBg variant="foregroundInverted">
            <History />
          </ImageCircleBg>
          <h2>{tHome("updates.title")}</h2>
        </div>

        <Separator
          orientation="vertical"
          className="bg-ring/50 hidden lg:block"
        />

        <ul className="relative grid grid-cols-[auto_auto_minmax(0,1fr)] gap-x-6 gap-y-4 text-left lg:mx-auto">
          {updateHistory
            .slice()
            .reverse()
            .map((update, index) => (
              <li
                key={`update-${index}`}
                className={cn(
                  "col-span-3 grid items-baseline gap-x-3 rounded-md p-2 max-sm:gap-y-3 sm:grid-cols-subgrid",
                )}
              >
                <span className="bg-foreground/60 hidden size-2 rounded-full sm:block" />
                <time className="text-muted-foreground relative text-sm whitespace-nowrap">
                  {format.dateTime(new Date(update.date), dateFormattingRules)}
                </time>

                <span className="min-w-0 leading-relaxed wrap-break-word">
                  {tUpdates(update.id)}
                </span>
              </li>
            ))}
        </ul>
      </SectionWrapper>
    </div>
  );
}
