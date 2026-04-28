"use client";

import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import FactoryNotFound from "./not-found";

const FactoryIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isInvalid } = useActiveFactory();

  // TODO add skeletons
  if (isLoading) return null;
  if (isInvalid) return <FactoryNotFound />;

  return <>{children}</>;
};

export default FactoryIdLayout;
