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
        "px-clamp-x relative grid place-items-center text-center",
        "bg-card/50 backdrop-blur-sm",
        "via-background to-ring/10 from-ring/10 bg-linear-240",
      )}
    >
      <span className="from-primary/20 via-primary/50 to-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r" />
      <div className="max-w-page w-full py-6">
        <div className="text-muted-foreground space-y-2 pb-3 text-sm">
          <p className="text-pretty">
            {t.rich("fanMade", {
              link: (chunks) => (
                <SmartLink href="https://github.com/Dudeldups/big-ambitions-tools">
                  {chunks}
                </SmartLink>
              ),
            })}
          </p>

          <p className="text-pretty">{t("assets")}</p>
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
