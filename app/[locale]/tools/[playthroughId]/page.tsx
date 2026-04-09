"use client";

import { Link } from "@/i18n/navigation";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Factory } from "lucide-react";

const PlaythroughIdPage = () => {
  // const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();

  // TODO add skeletons
  if (!activePlaythrough) {
    return null;
  }

  return (
    <div>
      <div>
        <div>
          <p>Go back to the playthrough overview:</p>
          <Link href="/tools">Playthroughs</Link>
        </div>

        <h2>
          Your playthrough{" "}
          <span className="font-semibold">
            {activePlaythrough.characterName}
          </span>
        </h2>

        <p>
          This section is still a work in progress. You can visit the factories
          page to see an overview of your factories, keep track of items you
          need to order for your production lines and more. The factory planner
          also shows you how many pallet shelves and factory workers you will
          need for an efficient production process.
        </p>

        <Link href={`/tools/${activePlaythrough.id}/factories`}>
          <Factory />
          Factories
        </Link>
      </div>
    </div>
  );
};

export default PlaythroughIdPage;
