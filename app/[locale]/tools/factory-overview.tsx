"use client";

import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";

const FactoryOverview = () => {
  const factories = usePlaythroughState((state) => state.factories);

  return (
    <div>
      <div>
        {!factories ? (
          <p>Loading factories...</p>
        ) : (
          <ul>
            {factories.map((factory) => (
              <li
                className="mt-4 space-y-2 rounded-md border p-2"
                key={factory.id}
              >
                <h3>{factory.name}</h3>
                <p>{factory.description}</p>
                <ul>
                  {factory.workstations.map((ws, index) => (
                    <li key={index}>
                      {ws.name} - {ws.product}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FactoryOverview;
