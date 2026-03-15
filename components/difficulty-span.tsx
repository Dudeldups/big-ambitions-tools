"use client";

import { Spinner } from "./ui/spinner";
import { useAppState } from "@/lib/hooks/useAppState";

const DifficultySpan = () => {
  const difficulty = useAppState((state) => state.difficulty);

  if (!difficulty) {
    return <Spinner />;
  }

  return (
    <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
  );
};

export default DifficultySpan;
