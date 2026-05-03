import SectionWrapper from "@/components/deco/section-wrapper";
import { useTranslations } from "next-intl";

const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  const tGeneral = useTranslations("general");
  const tContact = useTranslations("contact");

  return (
    <div className="main-wrapper">
      <SectionWrapper centerMobile variant="secondary">
        <hgroup className="grid items-end gap-14 md:grid-cols-[2fr_3fr] lg:gap-24">
          <h1>{tGeneral("contact")}</h1>

          <div className="max-w-lg">
            <p className="text-h5">{tContact("subheading")}</p>
          </div>
        </hgroup>
      </SectionWrapper>

      {children}
    </div>
  );
};

export default ContactLayout;
