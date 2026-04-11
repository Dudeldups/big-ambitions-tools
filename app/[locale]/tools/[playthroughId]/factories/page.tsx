"use client";

import FactoryInfoCard from "@/components/tools/factory-info-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Plus } from "lucide-react";

const FactoriesPage = () => {
  // const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();

  // TODO add skeletons
  if (!activePlaythrough) {
    return null;
  }

  const hasFactories = activePlaythrough.factoryIds.length !== 0;

  return (
    <div className="max-w-page mx-auto">
      <div>
        <p>Go back to the playthrough overview:</p>
        <Link href="/tools">Playthroughs</Link>
      </div>

      <h2>Factories in this playthrough:</h2>

      {!hasFactories ? (
        <>
          <p>No factories yet. Create one here:</p>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href={`/tools/${activePlaythrough.id}/factories/create`}>
              <Plus className="size-5" />
              New factory
            </Link>
          </Button>
        </>
      ) : (
        <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activePlaythrough.factoryIds.map((factoryId) => (
            <li key={factoryId} className="w-full max-w-96">
              <FactoryInfoCard factoryId={factoryId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FactoriesPage;
