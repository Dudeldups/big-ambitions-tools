import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { updateHistory } from "@/lib/updateHistory";
import { sLink } from "@/i18n/defaults";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import SectionWrapper from "@/components/section-wrapper";
import { Calculator, DatabaseSearch, PencilRuler } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const heroIcons = [
  { Icon: Calculator, id: "calc" },
  { Icon: DatabaseSearch, id: "db" },
  { Icon: PencilRuler, id: "ruler" },
];

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
      <SectionWrapper
        variant="primary"
        centerMobile
        className="gap-20 md:gap-32"
      >
        {/* Main hero section */}
        <hgroup className="grid items-start gap-14 max-md:max-w-lg md:grid-cols-[3fr_2fr] md:gap-y-24 xl:grid-cols-2">
          <h1 className="home-h1">Big Ambitions Tools</h1>

          <div className="hero-icon-container relative flex items-center justify-center gap-3 self-stretch sm:gap-10 md:row-span-2 md:flex-col @sm:gap-6">
            {heroIcons.map(({ Icon, id }) => (
              <span
                key={id}
                className="bg-secondary flex items-center justify-center rounded-full p-2 sm:p-4"
              >
                <Icon className="text-secondary-foreground size-10 sm:size-14" />
              </span>
            ))}
          </div>

          <p className="text-h5 max-w-2xl self-end text-pretty">
            {rich("intro.desc")}
          </p>
        </hgroup>
      </SectionWrapper>

      <SectionWrapper centerMobile className="gap-16 md:gap-24">
        {/* Game description */}
        <div className="grid justify-center gap-8 lg:grid-cols-2">
          <hgroup className="max-lg:text-center">
            <h2>{tHome("game.title")}</h2>
            <em className="text-h3 text-muted-foreground my-4 block font-semibold italic">
              {tHome("game.subtitle")}
            </em>
          </hgroup>

          <div className="bg-card border-ring p-clamp-x card--quote max-w-xl overflow-visible rounded-xl border md:mx-6">
            <blockquote className="text-h5 text-card-foreground leading-relaxed text-pretty max-lg:text-center">
              {rich("game.desc")}
            </blockquote>
          </div>
        </div>

        {/* Official links */}
        <ul className="flex flex-col items-center gap-6">
          <li>
            <div className="border-accent rounded-xl border-2 p-4 md:p-6">
              {rich("game.hovgaard", {
                website: sLink("https://www.bigambitionsgame.com/"),
              })}
            </div>
          </li>

          <li>
            <div>
              {rich("game.steam", {
                link: sLink(
                  "https://store.steampowered.com/app/1331550/Big_Ambitions/",
                ),
              })}
            </div>
          </li>
        </ul>
      </SectionWrapper>

      <Separator className="max-w-page via-foreground/20 mx-auto bg-linear-to-r from-transparent to-transparent" />

      <SectionWrapper>
        {/* CTA */}
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

        {/* Feedback  */}
        <p className="">
          {rich("cta.errorDesc", {
            contact: sLink("/contact"),
          })}
        </p>
      </SectionWrapper>

      <Separator className="max-w-page via-foreground/20 mx-auto bg-linear-to-r from-transparent to-transparent" />

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
