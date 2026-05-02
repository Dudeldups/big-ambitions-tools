import Address from "@/components/address";
import SectionWrapper from "@/components/deco/section-wrapper";
import { useTranslations } from "next-intl";

const LegalPage = () => {
  const t = useTranslations("legal");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <h1>{t("title")}</h1>
      </SectionWrapper>

      <SectionWrapper>
        <div className="space-y-4">
          {t.has("subtitle") && (
            <p className="text-lg font-semibold">{t("subtitle")}</p>
          )}

          <Address />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default LegalPage;
