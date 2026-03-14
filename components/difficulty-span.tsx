"use client";

import { useAppStore } from "@/lib/store/app-store";

const DifficultySpan = () => {
  const difficulty = useAppStore((state) => state.difficulty);

  return (
    <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
  );
};

export default DifficultySpan;
