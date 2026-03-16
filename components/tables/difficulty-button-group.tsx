"use client";

import { useAppState } from "@/lib/hooks/useAppState";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useAppStore } from "@/lib/stores/appStore";
import { useTranslations } from "next-intl";

type DifficultyButtonGroupProps = {
  className?: string;
};

const DifficultyButtonGroup = ({ className }: DifficultyButtonGroupProps) => {
  const difficulty = useAppState((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);

  const tGeneral = useTranslations("general");

  return (
    <ButtonGroup className={className}>
      <Button
        variant={difficulty === "easy" ? "secondary" : "outline"}
        onClick={() => setDifficulty("easy")}
      >
        {tGeneral("difficultyOptions.easy")}
      </Button>
      <Button
        variant={difficulty === "normal" ? "secondary" : "outline"}
        onClick={() => setDifficulty("normal")}
      >
        {tGeneral("difficultyOptions.normal")}
      </Button>
      <Button
        variant={difficulty === "hard" ? "secondary" : "outline"}
        onClick={() => setDifficulty("hard")}
      >
        {tGeneral("difficultyOptions.hard")}
      </Button>
    </ButtonGroup>
  );
};

export default DifficultyButtonGroup;
