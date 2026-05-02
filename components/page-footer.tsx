import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SmartLink } from "./smart-link";
import { Separator } from "./ui/separator";

const PageFooter = () => {
  const t = useTranslations("");

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
      {/* bg-line */}
      <span className="from-primary/20 via-primary/50 to-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r" />

      {/* inner footer */}
      <div className="max-w-page w-full space-y-3 py-6">
        <div className="mx-auto grid max-w-max gap-3 text-sm max-sm:mb-5 sm:grid-cols-[1fr_auto_1fr]">
          <SmartLink
            href="/privacy"
            className="justify-self-end hover:underline"
          >
            {t("legal.link")}
          </SmartLink>

          <Separator
            orientation="vertical"
            className="bg-foreground/20 mx-3 hidden sm:block"
          />

          <SmartLink
            href="/legal"
            className="justify-self-start hover:underline"
          >
            {t("privacy.link")}
          </SmartLink>
        </div>

        <div className="text-muted-foreground space-y-2 text-sm">
          <p className="text-pretty">
            {t.rich("footer.fanMade", {
              link: (chunks) => (
                <SmartLink
                  href="https://github.com/Dudeldups/big-ambitions-tools"
                  className="hover:underline"
                >
                  {chunks}
                </SmartLink>
              ),
            })}
          </p>

          <p className="text-pretty">{t("footer.assets")}</p>
        </div>

        <p className="font-medium">
          © {startYear}
          {currentYear > startYear && ` - ${currentYear}`}{" "}
          <SmartLink
            href="https://github.com/Dudeldups"
            className="hover:underline"
          >
            Dudeldups
          </SmartLink>
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
