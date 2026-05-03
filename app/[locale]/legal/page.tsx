import Address from "@/components/address";
import ImageCircleBg from "@/components/deco/image-circle-bg";
import SectionWrapper from "@/components/deco/section-wrapper";
import { Scale } from "lucide-react";
import { useTranslations } from "next-intl";

const LegalPage = () => {
  const t = useTranslations("legal");

  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <h1>{t("title")}</h1>
      </SectionWrapper>

      <SectionWrapper className="items-center md:items-start">
        <ImageCircleBg size="2xl" variant="accent">
          <Scale />
        </ImageCircleBg>

        <div className="bg-card border-border shadow-accent mt-8 max-w-max space-y-4 rounded-xl border p-8 shadow-md">
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
