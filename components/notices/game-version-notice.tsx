"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

type GameVersionNoticeProps = {
  onDismiss?: () => void;
};

const GameVersionNotice = ({ onDismiss }: GameVersionNoticeProps) => {
  return (
    <Card className="border-alert max-w-page mx-auto my-8 border">
      <CardContent className="flex gap-3 md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold">Versioned game data</p>
          <p className="text-muted-foreground">
            Playthroughs now use versioned game data. Existing saves were
            defaulted to version 0.10. You can edit the game version for each
            playthrough in the overview.
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
