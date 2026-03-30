"use client";

import { useAppState } from "@/lib/hooks/useAppState";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useAppStore } from "@/lib/stores/appStore";
import { useTranslations } from "next-intl";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";

type DifficultyButtonGroupProps = {
  className?: string;
};

const DifficultyButtonGroup = ({ className }: DifficultyButtonGroupProps) => {
  const difficulty = useAppState((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);

  const tGeneral = useTranslations("general");

  return (
    <ButtonGroup className={className} role="radiogroup">
      {DIFFICULTY_OPTIONS.map((value) => {
        const isActive = difficulty === value;

        return (
          <Button
            key={value}
            asChild
            variant={isActive ? "secondary" : "outline"}
            className="has-focus-visible:focus-ring capitalize"
          >
            <label className="cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={value}
                checked={isActive}
                onChange={() => setDifficulty(value)}
                className="sr-only"
              />
              {tGeneral(`difficultyOptions.${value}`)}
            </label>
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default DifficultyButtonGroup;
