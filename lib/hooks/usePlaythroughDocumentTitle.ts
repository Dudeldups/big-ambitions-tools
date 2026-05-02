import { useEffect } from "react";
import { GLOSSARY } from "@/i18n/glossary";
import { usePathname } from "@/i18n/navigation";

export function usePlaythroughDocumentTitle(title?: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (!title) return;

    document.title = `${title} | ${GLOSSARY.siteName}`;
  }, [title, pathname]);
}
