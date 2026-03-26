"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { Plus } from "lucide-react";

const PlaythroughId = () => {
  const { activePlaythrough } = useActivePlaythrough();

  const factories = usePlaythroughState((s) => s.factories);

  if (!activePlaythrough) {
    return null;
  }

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
              Click me
            </Link>
          </>
        ) : (
          <ul>
            {activePlaythrough?.factoryIds.map((factoryId) => (
              <li key={factoryId}>
                <p>{factoryId}</p>
                <p>{factories?.find((f) => f.id === factoryId)?.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaythroughId;
