"use client";

import { useActiveFactory } from "@/lib/hooks/useActiveFactory";

const FactoryIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isInvalid } = useActiveFactory();

  if (isLoading) return <div>Loading...</div>;
  if (isInvalid) return <div>NotFound</div>;

  return <>{children}</>;
};

export default FactoryIdLayout;
