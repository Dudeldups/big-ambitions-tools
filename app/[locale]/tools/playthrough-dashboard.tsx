import { Button } from "@/components/ui/button";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import CreateFactoryForm from "./create-factory-form";

const PlaythroughDashboard = () => {
  const activePlaythrough = usePlaythroughState((s) =>
    s.playthroughs.find((p) => p.id === s.activePlaythroughId),
  );
  const factories = usePlaythroughState((s) => s.factories);
  const setActivePlaythrough = usePlaythroughStore(
    (s) => s.setActivePlaythrough,
  );

  return (
    <div>
      <Button onClick={() => setActivePlaythrough(null)}>Go back</Button>

      <h2>PlaythroughDashboard for</h2>
      <p>{activePlaythrough?.characterName}</p>

      <div>
        <div>
          <p>Add a factory:</p>
          <CreateFactoryForm />
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

export default PlaythroughDashboard;
