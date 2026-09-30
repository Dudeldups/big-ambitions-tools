import SectionWrapper from "@/components/deco/section-wrapper";
import ImageCircleBg from "@/components/deco/image-circle-bg";
import { SmartLink } from "@/components/smart-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { ExternalLink, Globe, Map } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.211.375-.457.88-.626 1.281a18.27 18.27 0 0 0-5.416 0 13.577 13.577 0 0 0-.635-1.281A19.736 19.736 0 0 0 3.87 4.37C.782 8.935-.055 13.387.364 17.776a19.9 19.9 0 0 0 5.993 3.03c.483-.659.914-1.359 1.286-2.097a12.973 12.973 0 0 1-2.025-.983c.17-.124.336-.253.496-.386 3.905 1.826 8.149 1.826 12.008 0 .162.133.328.262.496.386a12.88 12.88 0 0 1-2.028.984c.372.737.802 1.438 1.286 2.096a19.86 19.86 0 0 0 6.002-3.03c.491-5.088-.838-9.5-3.561-13.406ZM8.02 15.094c-1.172 0-2.133-1.075-2.133-2.386 0-1.31.94-2.387 2.133-2.387 1.193 0 2.154 1.076 2.133 2.387 0 1.31-.94 2.386-2.133 2.386Zm7.96 0c-1.172 0-2.133-1.075-2.133-2.386 0-1.31.94-2.387 2.133-2.387 1.193 0 2.154 1.076 2.133 2.387 0 1.31-.94 2.386-2.133 2.386Z" />
    </svg>
  );
}

const resources = [
  {
    id: "baMaps",
    href: "https://bamaps.org/",
    badge: "community",
    Icon: Map,
    accent:
      "[--resource-accent:var(--color-primary)] dark:[--resource-accent:var(--color-primary-light)]",
  },
  {
    id: "biggerAmbitions",
    href: "https://www.biggerambitions.com/",
    badge: "community",
    Icon: Globe,
    accent:
      "[--resource-accent:var(--color-brand-secondary)] dark:[--resource-accent:var(--color-brand-secondary-light)]",
  },
  {
    id: "discord",
    href: "https://discord.com/invite/hovgaardgames",
    badge: "official",
    Icon: DiscordIcon,
    accent: "[--resource-accent:#5865f2] dark:[--resource-accent:#8891f5]",
  },
] as const;

export async function generateMetadata({ params }: TranslatedMetadataProps) {
  const { locale } = await params;
  return generateTranslatedMetadata({
    locale,
    titleNamespace: "resources",
    descriptionNamespace: "metadata.resources",
    path: "/resources",
  });
}

export default function ResourcesPage() {
  const t = useTranslations("resources");
  return (
    <div className="main-wrapper">
      <SectionWrapper variant="secondary" centerMobile>
        <hgroup className="grid items-end gap-14 min-[960px]:grid-cols-[max-content_minmax(0,1fr)] md:max-[960px]:grid-cols-[3fr_2fr] xl:gap-24">
          <h1 className="min-[960px]:whitespace-nowrap">{t("title")}</h1>
          <div className="max-w-lg">
            <p className="text-h5 text-pretty">{t("intro")}</p>
          </div>
        </hgroup>
      </SectionWrapper>
      <SectionWrapper centerMobile={false} className="gap-10">
        <div className="grid w-full gap-6 lg:grid-cols-3">
          {resources.map(({ id, href, badge, Icon, accent }) => (
            <Card
              key={id}
              className={cn(
                "border-border relative gap-6 border shadow-sm ring-0 transition-[transform,border-color,box-shadow] duration-200 focus-within:border-[color-mix(in_oklab,var(--resource-accent)_30%,var(--color-border))] hover:border-[color-mix(in_oklab,var(--resource-accent)_30%,var(--color-border))] hover:shadow-[0_0_20px_color-mix(in_oklab,var(--resource-accent)_8%,transparent)] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none",
                accent,
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0.75 bg-(--resource-accent) opacity-80"
              />
              <CardHeader className="gap-5 px-6 pt-2">
                <div className="flex items-start justify-between gap-4">
                  <ImageCircleBg
                    size="sm"
                    className="shrink-0 bg-[color-mix(in_oklab,var(--resource-accent)_10%,var(--color-card))] text-(--resource-accent) ring-1 ring-[color-mix(in_oklab,var(--resource-accent)_18%,transparent)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center"
                    >
                      <Icon className="size-8" />
                    </span>
                  </ImageCircleBg>
                  <span className="bg-secondary-foreground text-background min-w-0 rounded-full border border-transparent px-3 py-1 text-center text-xs leading-relaxed font-semibold tracking-wider uppercase">
                    {t(`badges.${badge}`)}
                  </span>
                </div>
                <h2 className="text-h4 text-pretty">{t(`${id}.title`)}</h2>
              </CardHeader>
              <CardContent className="flex-1 px-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t(`${id}.description`)}
                </p>
              </CardContent>
              <CardFooter className="px-6 py-5">
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="h-auto min-h-9 w-full py-2 whitespace-normal"
                >
                  <SmartLink
                    href={href}
                    className="text-secondary-foreground dark:text-secondary-foreground no-underline hover:no-underline"
                  >
                    {t(`${id}.cta`)}
                    <ExternalLink aria-hidden="true" />
                    <span className="sr-only">{t("opensInNewTab")}</span>
                  </SmartLink>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {t("suggestion")}{" "}
          <SmartLink
            href="/contact"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {t("suggestCta")}
          </SmartLink>
        </p>
      </SectionWrapper>
    </div>
  );
}
