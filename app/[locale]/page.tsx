import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { updateHistory } from "@/lib/updateHistory";
import { sLink } from "@/i18n/defaults";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import SectionWrapper from "@/components/section-wrapper";

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
        <hgroup className="mb-14 flex flex-col gap-10">
          <h1 className="home-h1">
            {rich("intro.title", {
              name: (chunks) => <span className="block">{chunks}</span>,
            })}
          </h1>

          <p>{rich("intro.desc")}</p>
        </hgroup>

        <p>{tHome("intro.gameDesc")}</p>
        <p>
          {rich("intro.gameDesc2", {
            website: sLink("https://https://www.bigambitionsgame.com/"),
            link: sLink(
              "https://store.steampowered.com/app/1331550/Big_Ambitions/",
            ),
          })}
        </p>

        <p>
          {rich("intro.errorDesc", {
            contact: sLink("/contact"),
          })}
        </p>
      </SectionWrapper>

      <div className="section-wrapper relative">
        <section>
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
        </section>
      </div>

      <div className="section-wrapper">
        <section>
          <h2>{tHome("updates.title")}</h2>
          <ul>
            {updateHistory
              .slice()
              .reverse()
              .map((update, index) => (
                <li key={`update-${index}`}>
                  <time dateTime={update.date}>
                    {format.dateTime(
                      new Date(update.date),
                      dateFormattingRules,
                    )}
                  </time>{" "}
                  - {tUpdates(update.id)}
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
