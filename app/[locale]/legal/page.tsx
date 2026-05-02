import SectionWrapper from "@/components/deco/section-wrapper";
import { useTranslations } from "next-intl";

const name = process.env.NEXT_PUBLIC_LEGAL_NAME;
const line1 = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_LINE1;
const line2 = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_LINE2;
const city = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_CITY;
const email = process.env.NEXT_PUBLIC_LEGAL_EMAIL;

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

          <address className="space-y-1 not-italic">
            {name && <p>{name}</p>}
            {line1 && <p>{line1}</p>}
            {line2 && <p>{line2}</p>}
            {city && <p>{city}</p>}

            {email && (
              <p className="pt-2">
                E-Mail:{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline hover:no-underline"
                >
                  {email}
                </a>
              </p>
            )}
          </address>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default LegalPage;
