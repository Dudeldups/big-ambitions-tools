import ContactForm from "@/components/contact-form";
import SectionWrapper from "@/components/deco/section-wrapper";
import { useTranslations } from "next-intl";

const ContactPage = () => {
  const t = useTranslations("contact");

  return (
    <SectionWrapper>
      <div className="max-w-2xl">
        <p>{t("intro")}</p>
      </div>

      <div className="mt-10 space-y-6">
        <h2>{t("form.title")}</h2>

        <ContactForm />
      </div>
    </SectionWrapper>
  );
};

export default ContactPage;
