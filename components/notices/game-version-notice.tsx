"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sLink } from "@/i18n/defaults";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";
import { X } from "lucide-react";

type GameVersionNoticeProps = {
  onDismiss: () => void;
};

const GameVersionNotice = ({ onDismiss }: GameVersionNoticeProps) => {
  const { t, rich } = useRichDefaults("tools.playthroughs.gameVersionNotice");

  return (
    <Card className="border-alert max-w-page mx-auto my-8 border">
      <CardContent className="flex gap-3 md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold">{t("title")}</p>
          <p className="text-muted-foreground">
            {rich("desc", { link: sLink("/tools") })}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dismiss notice"
        >
          <X className="size-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameVersionNotice;
