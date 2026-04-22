import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const PageFooter = () => {
  const t = useTranslations("footer");

  const startYear = 2026;
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative mt-14 grid place-items-center text-center md:mt-24",
        "bg-card/50 backdrop-blur-sm",
        "via-background/20 to-ring/10 from-ring/10 bg-linear-240",
      )}
    >
      <span className="from-primary/10 via-primary/50 absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent" />
      <div className="max-w-page w-full p-6">
        <div className="text-muted-foreground space-y-2 pb-3 text-sm">
          <p>{t("fanMade")}</p>

          <p>{t("assets")}</p>
        </div>

        <p className="font-medium">
          © {startYear}
          {currentYear > startYear && ` – ${currentYear}`}
          <a
            href="https://github.com/Dudeldups"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:text-primary-light underline-offset-4 transition-colors hover:underline"
          >
            {" "}
            Dudeldups
          </a>
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
