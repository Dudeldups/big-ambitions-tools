"use client";

import { Button } from "@/components/ui/button";
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
    <div className="max-w-page mx-auto">
      <div className="mt-8">
        <p>Go back to the playthrough overview:</p>
        <Link href="/tools">Playthroughs</Link>
      </div>

      <div className="my-8 max-w-xl rounded-xl border bg-cyan-900 p-4">
        <h2>
          Your playthrough{" "}
          <span className="font-semibold">
            {activePlaythrough.characterName}
          </span>
        </h2>

        <p>
          Visit the factories page to see an overview of your factories, keep
          track of items you need to order for your production lines and more.
          The factory planner will show you how many pallet shelves and factory
          workers you need for maximum efficiency.
        </p>
      </div>

      <Button className="size-32">
        <Link
          href={`/tools/${activePlaythrough.id}/factories`}
          className="flex flex-col items-center gap-4"
        >
          <Factory className="size-10" />
          <span className="text-lg font-bold">Factories</span>
        </Link>
      </Button>
    </div>
  );
};

export default PlaythroughIdPage;
