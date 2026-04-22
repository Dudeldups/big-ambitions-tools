import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { updateHistory } from "@/lib/updateHistory";
import { SmartLink } from "@/components/smart-link";

export default function Home() {
  const t = useTranslations("home");
  const tUpdateHistory = useTranslations("updateHistory");
  const format = useFormatter();
  const dateFormattingRules: DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return (
    <div className="main-wrapper">
      <div className="section-wrapper">
        <section>
          <hgroup>
            <h1>
              {t.rich("intro.title", {
                name: (chunks) => <span className="block">{chunks}</span>,
              })}
            </h1>

            <p>
              {t.rich("intro.desc", {
                i: (chunks) => <i>{chunks}</i>,
              })}
            </p>
          </hgroup>

          <p>{t("intro.gameDesc")}</p>
          <p>
            {t.rich("intro.gameDesc2", {
              website: (chunks) => (
                <SmartLink href="https://https://www.bigambitionsgame.com/">
                  {chunks}
                </SmartLink>
              ),
              steam: (chunks) => (
                <SmartLink href="https://store.steampowered.com/app/1331550/Big_Ambitions/">
                  {chunks}
                </SmartLink>
              ),
            })}
          </p>

          <p>
            {t.rich("intro.errorDesc", {
              contact: (chunks) => (
                <SmartLink href="/contact">{chunks}</SmartLink>
              ),
            })}
          </p>
        </section>
      </div>

      <div className="section-wrapper">
        <section>
          <h2>{t("cta.title")}</h2>
          <p>
            {t.rich("cta.desc", {
              i: (chunks) => <i>{chunks}</i>,
              database: (chunks) => (
                <SmartLink href="/database">{chunks}</SmartLink>
              ),
            })}
          </p>
          <p>
            {t.rich("cta.desc2", {
              tools: (chunks) => <SmartLink href="/tools">{chunks}</SmartLink>,
            })}
          </p>
        </section>
      </div>

      <div className="section-wrapper">
        <section>
          <h2>{t("updates.title")}</h2>
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
                  - {tUpdateHistory(update.id)}
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
