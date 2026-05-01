import { Rubik, Rubik_Mono_One, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { StoreHydration } from "@/components/providers/store-hydration";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import { cn } from "@/lib/utils";
import Script from "next/script";
import {
  generateTranslatedMetadata,
  TranslatedMetadataProps,
} from "@/lib/generateTranslatedMetadata";
import { Metadata } from "next";
import { GLOSSARY } from "@/i18n/glossary";

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const rubikMono = Rubik_Mono_One({
  variable: "--font-rubik-mono",
  weight: ["400"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: TranslatedMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return generateTranslatedMetadata({
    locale,
    descriptionNamespace: "metadata.root",
    descriptionValues: {
      gameName: GLOSSARY.gameName,
    },
    path: "/",
  });
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <Script
        defer
        src="https://analytics.big-ambitions-tools.com/script.js"
        data-website-id="9201b0ca-c66d-46fc-b24a-adf44dc44b16"
        data-domains="big-ambitions-tools.com,www.big-ambitions-tools.com"
        strategy="afterInteractive"
      />

      <body
        className={cn(
          "flex min-h-screen flex-col antialiased",
          rubikSans.variable,
          rubikMono.variable,
          poppins.variable,
        )}
      >
        <StoreHydration />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <TooltipProvider>
              <PageHeader />

              <main className="flex-1">{children}</main>

              <PageFooter />
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
