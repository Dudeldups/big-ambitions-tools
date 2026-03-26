"use client";

import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import PlaythroughNotFound from "./not-found";

const PlaythroughIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isInvalid } = useActivePlaythrough();

  if (isLoading) return <div>Loading...</div>;
  if (isInvalid) return <PlaythroughNotFound />;

  return <>{children}</>;
};

export default PlaythroughIdLayout;
