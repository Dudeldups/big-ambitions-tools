import {
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { useMemo, useState } from "react";
import FactoryInfoCard from "./factory-info-card";
import { cn } from "@/lib/utils";

type FactoryCardOverviewProps = {
  playthrough: Playthrough;
};

const FactoryCardOverview = ({ playthrough }: FactoryCardOverviewProps) => {
  const [draggedFactoryId, setDraggedFactoryId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);
  const addFactoryToGroup = usePlaythroughStore((s) => s.addFactoryToGroup);
  const removeFactoryFromAllGroups = usePlaythroughStore(
    (s) => s.removeFactoryFromAllGroups,
  );

  const ungroupedFactoryIds = useMemo(() => {
    const grouped = new Set(
      playthrough.factoryGroups.flatMap((g) => g.factoryIds),
    );

    return playthrough.factoryIds.filter((id) => !grouped.has(id));
  }, [playthrough]);

  return (
    <div>
      <h3 className="font-semibold">Factory groups</h3>

      <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {playthrough.factoryGroups.map((group) => (
          <li key={group.id} className="col-span-full w-full">
            {/* Group header */}
            <div
              className="mb-2 flex items-center gap-2 rounded-lg border"
              style={{ borderColor: group.color }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsOver(true);
              }}
              onDragLeave={() => setIsOver(false)}
              onDrop={() => {
                setIsOver(false);
                if (!draggedFactoryId) return;

                const isAlreadyInGroup =
                  group.factoryIds.includes(draggedFactoryId);
                if (isAlreadyInGroup) return;

                addFactoryToGroup(playthrough.id, draggedFactoryId, group.id);
                setDraggedFactoryId(null);
              }}
            >
              <span className="font-semibold">{group.name}</span>

              {/* Group factories */}
              <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.factoryIds.map((factoryId) => (
                  <li key={factoryId} className="w-full max-w-96">
                    <FactoryInfoCard
                      factoryId={factoryId}
                      setDraggedFactoryId={setDraggedFactoryId}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        {ungroupedFactoryIds && (
          <li
            className="col-span-full w-full"
            onDragOver={(e) => {
              e.preventDefault();
              setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={() => {
              setIsOver(false);
              if (!draggedFactoryId) return;

              removeFactoryFromAllGroups(playthrough.id, draggedFactoryId);
              setDraggedFactoryId(null);
            }}
          >
            <div className="mb-2 font-semibold opacity-70">Ungrouped</div>

            <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ungroupedFactoryIds.map((factoryId) => (
                <li
                  key={factoryId}
                  className={cn(
                    "relative z-10 w-full max-w-96 cursor-grab transition-colors",
                    isOver && "bg-accent/20",
                  )}
                  draggable
                  onDragStart={() => setDraggedFactoryId(factoryId)}
                  onDragEnd={() => setDraggedFactoryId(null)}
                >
                  <FactoryInfoCard
                    factoryId={factoryId}
                    setDraggedFactoryId={setDraggedFactoryId}
                  />
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FactoryCardOverview;
