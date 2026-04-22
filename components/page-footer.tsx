import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SmartLink } from "./smart-link";

const PageFooter = () => {
  const t = useTranslations("footer");

  const startYear = 2026;
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-card/50 backdrop-blur-sm",
        "via-background to-ring/10 from-ring/10 bg-linear-240",
      )}
    >
      <div className="max-w-page w-full p-6">
        <div className="text-muted-foreground space-y-2 pb-3 text-sm">
          <p>
            {t.rich("fanMade", {
              link: (chunks) => (
                <SmartLink href="https://github.com/Dudeldups/big-ambitions-tools">
                  {chunks}
                </SmartLink>
              ),
            })}
          </p>

          <p>{t("assets")}</p>
        </div>

        <p className="font-medium">
          © {startYear}
          {currentYear > startYear && ` - ${currentYear}`}{" "}
          <SmartLink href="https://github.com/Dudeldups">Dudeldups</SmartLink>
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
