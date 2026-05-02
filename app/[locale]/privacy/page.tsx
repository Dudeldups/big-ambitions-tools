import Address from "@/components/address";
import SectionWrapper from "@/components/deco/section-wrapper";
import { InfoList } from "@/components/privacy/info-list";
import PrivacyItemWrapper from "@/components/privacy/privacy-item-wrapper";
import { GLOSSARY } from "@/i18n/glossary";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import { useTranslations } from "next-intl";

const PrivacyPage = () => {
  const { t, rich } = useRichDefaults("privacy");
  const tGeneral = useTranslations("general");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="primary" centerMobile>
        <h1>{t("title")}</h1>
      </SectionWrapper>

      <SectionWrapper>
        <ol className="marker:text-h3 list-decimal space-y-8 ps-6 marker:font-bold max-md:list-inside">
          {/* General info */}
          <PrivacyItemWrapper title={t("generalInfo.title")}>
            <p>{t("generalInfo.intro")}</p>

            <p className="pt-4">{t("generalInfo.responsiblePerson")}</p>

            <Address />
          </PrivacyItemWrapper>

          {/* Server logs */}
          <PrivacyItemWrapper title={t("serverLogs.title")}>
            <InfoList
              title={t("serverLogs.intro")}
              items={t.raw("serverLogs.items")}
            />

            <p>{t("serverLogs.purpose")}</p>
            <p>{t("serverLogs.legalBasis")}</p>
          </PrivacyItemWrapper>

          {/* Analytics */}
          <PrivacyItemWrapper title={rich("analytics.title")}>
            <p>{rich("analytics.intro")}</p>

            <InfoList
              title={t("analytics.capturedData.title")}
              items={t.raw("analytics.capturedData.items")}
            />
            <InfoList
              title={t("analytics.privacyGuarantees.title")}
              items={t.raw("analytics.privacyGuarantees.items")}
            />

            <p>{t("analytics.summary")}</p>
            <p>{t("analytics.legalBasis")}</p>
          </PrivacyItemWrapper>

          {/* Cookies */}
          <PrivacyItemWrapper title={t("cookies.title")}>
            <p>{rich("cookies.intro")}</p>

            <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold">{tGeneral("name")}</dt>
              <dd>
                <code>{GLOSSARY.cookieNext}</code>
              </dd>

              <dt className="font-semibold">
                {t("cookies.details.purpose.title")}
              </dt>
              <dd>{t("cookies.details.purpose.desc")}</dd>

              <dt className="font-semibold">
                {t("cookies.details.duration.title")}
              </dt>
              <dd>{t("cookies.details.duration.desc")}</dd>
            </dl>

            <p>{t("cookies.summary")}</p>
            <p>{t("cookies.legalBasis")}</p>
          </PrivacyItemWrapper>

          {/* Rights */}
          <PrivacyItemWrapper title={t("userRights.title")}>
            <InfoList
              title={t("userRights.intro")}
              items={t.raw("userRights.items")}
            />

            <p>{t("userRights.contact")}</p>
          </PrivacyItemWrapper>

          {/* Changes */}
          <PrivacyItemWrapper title={t("changes.title")}>
            <p>{t("changes.intro")}</p>
          </PrivacyItemWrapper>
        </ol>
      </SectionWrapper>
    </div>
  );
};

export default PrivacyPage;
