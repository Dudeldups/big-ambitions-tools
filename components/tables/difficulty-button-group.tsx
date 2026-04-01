"use client";

import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";
import { useTranslations } from "next-intl";
import { RadioButtonGroup } from "../radio-button-group";
import { cn } from "@/lib/utils";

type DifficultyButtonGroupProps = {
  className?: string;
};

const DifficultyButtonGroup = ({ className }: DifficultyButtonGroupProps) => {
  const difficulty = useAppState((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);

  const t = useTranslations("general.difficultyOptions");

  return (
    <RadioButtonGroup
      className={cn(className)}
      name="difficulty"
      value={difficulty}
      onChange={setDifficulty}
      options={[
        { value: "easy", label: t("easy") },
        { value: "normal", label: t("normal") },
        { value: "hard", label: t("hard") },
      ]}
    />
  );
};

export default DifficultyButtonGroup;
