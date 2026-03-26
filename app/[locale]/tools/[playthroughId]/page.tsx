"use client";

import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { useParams } from "next/navigation";

const PlaythroughId = () => {
  const { playthroughId } = useParams<{ playthroughId: string }>();
  const activePlaythrough = usePlaythroughState((s) =>
    s.playthroughs.find((p) => p.id === playthroughId),
  );

  console.log(activePlaythrough);

  const factories = usePlaythroughState((s) => s.factories);

  if (!activePlaythrough) {
    return null;
  }

  return (
    <div>
      <h2>Playthrough info for</h2>
      <p>{activePlaythrough?.characterName}</p>

      <div>
        <div>
          <p>Add a factory:</p>
          <button>Button</button>
        </div>

        <h3>Factories in this playthrough:</h3>
        <ul>
          {activePlaythrough?.factoryIds.map((factoryId) => (
            <li key={factoryId}>
              <p>{factoryId}</p>
              <p>{factories?.find((f) => f.id === factoryId)?.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaythroughId;
