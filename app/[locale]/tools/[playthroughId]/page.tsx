"use client";

import FactoryInfoCard from "@/components/tools/factory-info-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Plus } from "lucide-react";

const PlaythroughId = () => {
  // const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();

  const hasFactories = activePlaythrough.factoryIds.length !== 0;

  return (
    <div>
      <h1>Playthrough info for</h1>
      <p>{activePlaythrough?.characterName}</p>

      <div>
        <div>
          <p>Go back to the playthrough overview:</p>
          <Link href="/tools">Playthroughs</Link>
        </div>

        {hasFactories && (
          <>
            <p>Create a new factory</p>
            <Button size="icon-lg" asChild>
              <Link href={`/tools/${activePlaythrough.id}/factories/create`}>
                <Plus className="size-5" />
              </Link>
            </Button>
          </>
        )}

        <h2>Factories in this playthrough:</h2>

        {!hasFactories ? (
          <>
            <p>No factories yet. Create one here:</p>
            <Link href={`/tools/${activePlaythrough.id}/factories/create`}>
              <Plus />
            </Link>
          </>
        ) : (
          <ul className="flex items-stretch gap-4">
            {activePlaythrough.factoryIds.map((factoryId) => (
              <li key={factoryId} className="mt-4">
                <Link
                  href={`/tools/${activePlaythrough.id}/factories/${factoryId}`}
                >
                  <FactoryInfoCard factoryId={factoryId} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaythroughId;
