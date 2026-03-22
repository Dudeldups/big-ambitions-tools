import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { usePlaythroughStore } from "../stores/playthroughStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useActivePlaythrough() {
  const t = useTranslations("errors.playthrough");
  const router = useRouter();
  const params = useParams<{ playthroughId: string }>();
  const { playthroughId } = params;

  const hasHydrated = usePlaythroughStore((state) => state._hasHydrated);

  const activePlaythrough = usePlaythroughStore((s) =>
    playthroughId ? s.getPlaythroughById(playthroughId) : undefined,
  );

  useEffect(() => {
    if (!hasHydrated) return;

    if (!playthroughId || !activePlaythrough) {
      toast.error(t("notFound"));
      router.replace("/tools");
    }
  }, [playthroughId, activePlaythrough, router, hasHydrated, t]);

  return activePlaythrough;
}
