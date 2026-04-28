"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CopyButton = ({ value }: { value: number }) => {
  const t = useTranslations("general");
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = async () => {
    setIsClicked(true);
    await navigator.clipboard.writeText(String(value));
    setTimeout(() => {
      setIsClicked(false);
    }, 1500);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label={t("copy")}
    >
      {isClicked ? (
        <Check className="text-success size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
};

export default CopyButton;
