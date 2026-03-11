import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "next-intl";
import { Link } from "@/i18n/navigation";
import { updateHistory } from "@/lib/updateHistory";

export default function Home() {
  const t = useTranslations("home");
  const format = useFormatter();
  const dateFormattingRules: DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return (
    <div>
      <section>
        <hgroup>
          <h1>{t("intro.title")}</h1>
          <p>
            {t.rich("intro.desc", {
              i: (chunks) => <i>{chunks}</i>,
            })}
          </p>
          <p>
            {t.rich("intro.desc2", {
              contact: (chunks) => (
                <Link href="/contact" className="underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </hgroup>

        <p>{t("intro.gameDesc")}</p>
        <p>
          {t.rich("intro.gameDesc2", {
            website: (chunks) => (
              <a
                href="https://https://www.bigambitionsgame.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {chunks}
              </a>
            ),
            steam: (chunks) => (
              <a
                href="https://store.steampowered.com/app/1331550/Big_Ambitions/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </section>

      <section>
        <h2>{t("cta.title")}</h2>
        <p>
          {t.rich("cta.desc", {
            i: (chunks) => <i>{chunks}</i>,
            database: (chunks) => (
              <Link href="/database" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>
          {t.rich("cta.desc2", {
            tools: (chunks) => (
              <Link href="/tools" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>

      <section>
        <h2>{t("updates.title")}</h2>
        <ul>
          {updateHistory
            .slice()
            .reverse()
            .map((update, index) => (
              <li key={`update-${index}`}>
                <time dateTime={update.date}>
                  {format.dateTime(new Date(update.date), dateFormattingRules)}
                </time>{" "}
                - {t(`updates.${index}`)}
              </li>
            ))}
        </ul>
      </section>

      <Link locale="en" href="/" className="underline">
        English
      </Link>
      <br />
      <Link locale="de" href="/" className="underline">
        Deutsch
      </Link>
    </div>
  );
}
