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
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
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
            <div
              className={cn(
                "mb-2 rounded-lg border transition-colors",
                hoveredGroup === group.id && "bg-accent/40 brightness-125",
              )}
              style={{
                borderColor: group.color,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setHoveredGroup(group.id);
              }}
              onDragLeave={() => setHoveredGroup(null)}
              onDrop={() => {
                if (!draggedFactoryId) return;

                setDraggedFactoryId(null);
                setHoveredGroup(null);

                const isAlreadyInGroup =
                  group.factoryIds.includes(draggedFactoryId);
                if (isAlreadyInGroup) return;

                addFactoryToGroup(playthrough.id, draggedFactoryId, group.id);
              }}
            >
              <span className="font-semibold">{group.name}</span>

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
          <li className="col-span-full w-full">
            <div
              className={cn(
                "border-muted mb-2 rounded-lg border transition-colors",
                hoveredGroup === "ungrouped" && "bg-accent/40 brightness-125",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setHoveredGroup("ungrouped");
              }}
              onDragLeave={() => setHoveredGroup(null)}
              onDrop={() => {
                if (!draggedFactoryId) return;

                removeFactoryFromAllGroups(playthrough.id, draggedFactoryId);
                setDraggedFactoryId(null);
                setHoveredGroup(null);
              }}
            >
              <h3 className="font-semibold">Ungrouped factories</h3>

              <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ungroupedFactoryIds.map((factoryId) => (
                  <li
                    key={factoryId}
                    className={cn(
                      "w-full max-w-96 transition-colors",
                      hoveredGroup === "ungrouped" && "bg-accent/20",
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
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FactoryCardOverview;
