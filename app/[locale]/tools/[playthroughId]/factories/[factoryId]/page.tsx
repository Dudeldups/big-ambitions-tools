"use client";

import { Link } from "@/i18n/navigation";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";

const FactoryIdPage = () => {
  const { activePlaythrough } = useActivePlaythrough();
  const { activeFactory } = useActiveFactory();

  // TODO add skeletons
  if (!activeFactory || !activePlaythrough) return null;

  return (
    <div>
      FactoryIdPage
      <pre>{JSON.stringify(activeFactory, null, 2)}</pre>
      <Link
        href={`/tools/${activePlaythrough.id}/factories/${activeFactory.id}/edit`}
      >
        Edit factory
      </Link>
    </div>
  );
};

export default FactoryIdPage;
