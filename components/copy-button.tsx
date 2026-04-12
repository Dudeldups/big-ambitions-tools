"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CopyButton = ({ value }: { value: number }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = async () => {
    setIsClicked(true);
    await navigator.clipboard.writeText(String(value));
    setTimeout(() => {
      setIsClicked(false);
    }, 1500);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleCopy}>
      {isClicked ? (
        <Check className="size-4 text-green-600" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
};

export default CopyButton;
