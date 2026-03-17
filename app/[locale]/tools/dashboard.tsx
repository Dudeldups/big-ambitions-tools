"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { SquarePen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const Dashboard = () => {
  const t = useTranslations();
  const playthroughs = usePlaythroughState((state) => state.playthroughs);
  const deletePlaythrough = usePlaythroughStore(
    (state) => state.deletePlaythrough,
  );
  const editPlaythrough = usePlaythroughStore((state) => state.editPlaythrough);

  return (
    <div>
      <hgroup>
        <h3>Dashboard</h3>

        <p>
          Manage your playthroughs and view stats. This is where you can keep
          track of all your progress and make adjustments as needed.
        </p>
      </hgroup>

      <div>
        {!playthroughs ? (
          <Spinner />
        ) : playthroughs.length === 0 ? (
          <p>
            You don&apos;t have any playthroughs yet. Create one to get started!
          </p>
        ) : (
          <ul className="flex flex-wrap gap-5">
            {playthroughs.map((pt) => (
              <li
                key={pt.id}
                className="flex items-center gap-8 rounded-md border p-4"
              >
                <hgroup>
                  <h4 className="text-lg font-semibold">{pt.characterName}</h4>
                  <p className="text-muted-foreground mt-1">
                    {t("general.difficulty")}:{" "}
                    {t(`general.difficultyOptions.${pt.difficulty}`)}
                  </p>
                </hgroup>

                <div className="ml-auto flex items-center gap-2">
                  <Button size="icon-lg" variant="outline">
                    <SquarePen className="size-5" />
                  </Button>

                  <Button
                    size="icon-lg"
                    variant="destructive"
                    onClick={() => deletePlaythrough(pt.id)}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
