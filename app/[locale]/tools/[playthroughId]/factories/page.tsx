"use client";

import CreateGroupForm from "@/components/tools/create-group-form";
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
      <div className="my-8 flex flex-wrap gap-3 space-y-4">
        <Button asChild variant="default">
          <Link href="/tools">Playthroughs</Link>
        </Button>

        <CreateGroupForm />
      </div>

      <div className="my-8 rounded-xl border bg-cyan-900 p-4">
        <h2>Your factories</h2>

        <p className="mt-6 mb-2">
          An overview of your factories. You can edit or delete them and also
          copy the current values for a new factory. To see more details about
          each factory including a shopping list, just click their respective
          card.
        </p>

        <p>
          You can also group them together by clicking the Group factories
          button at the top of the page. This will allow you to see those
          factories in one place and manage them as a group. Helpful if you use
          a central warehouse to provide ingredients for multiple factories.
        </p>
      </div>

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
