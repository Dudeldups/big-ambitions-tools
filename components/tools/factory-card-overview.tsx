import {
  FactoryGroup,
  Playthrough,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";
import { useMemo, useState } from "react";
import FactoryInfoCard from "./factory-info-card";
import { cn } from "@/lib/utils";
import DeleteDialog from "../delete-dialog";
import { useTranslations } from "next-intl";
import CreateGroupForm from "./create-group-form";
import GroupShoppingListDialog from "./group-shopping-list-dialog";
import GroupDeliveriesDialog from "./group-deliveries-dialog";
import EditGroupForm from "./edit-group-form";

type FactoryCardOverviewProps = {
  playthrough: Playthrough;
};

const FactoryCardOverview = ({ playthrough }: FactoryCardOverviewProps) => {
  const t = useTranslations("tools");
  const tModals = useTranslations("modals");
  const [draggedFactoryId, setDraggedFactoryId] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const addFactoryToGroup = usePlaythroughStore((s) => s.addFactoryToGroup);
  const removeFactoryFromAllGroups = usePlaythroughStore(
    (s) => s.removeFactoryFromAllGroups,
  );
  const deleteFactoryGroup = usePlaythroughStore((s) => s.deleteFactoryGroup);

  const ungroupedFactoryIds = useMemo(() => {
    const grouped = new Set(
      playthrough.factoryGroups.flatMap((g) => g.factoryIds),
    );

    return playthrough.factoryIds.filter((id) => !grouped.has(id));
  }, [playthrough]);

  const onDropGroup = (group: FactoryGroup) => {
    if (!draggedFactoryId) return;

    setDraggedFactoryId(null);
    setHoveredGroup(null);

    const isAlreadyInGroup = group.factoryIds.includes(draggedFactoryId);
    if (isAlreadyInGroup) return;

    addFactoryToGroup(playthrough.id, draggedFactoryId, group.id);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 max-md:items-center md:flex-row">
        <div className="max-w-md md:max-w-2xl">
          <h3 className="mb-6 font-semibold">{t("factoryGroups.title")}</h3>
          <p className="text-muted-foreground mt-3">
            {t("factoryGroups.desc")}
          </p>
        </div>

        <CreateGroupForm />
      </div>

      <ul className="mt-6 grid gap-6">
        {playthrough.factoryGroups.map((group) => (
          <li key={group.id} className="w-full">
            <div
              className={cn(
                "@container/list-outer space-y-3 rounded-lg border-2 p-4 transition-colors",
                hoveredGroup === group.id && "bg-accent/80",
              )}
              style={{
                borderColor:
                  hoveredGroup === group.id
                    ? `color-mix(in srgb, ${group.color}, white 30%)`
                    : group.color,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setHoveredGroup(group.id);
              }}
              onDragLeave={() => setHoveredGroup(null)}
              onDrop={() => onDropGroup(group)}
            >
              <div className="@container flex justify-between gap-6 @max-xl:flex-col">
                <span className="mb-6 inline-block font-semibold">
                  {group.name}
                </span>

                <div className="flex gap-2 @max-xl:flex-col @max-xl:*:w-full">
                  <GroupDeliveriesDialog factoryIds={group.factoryIds} />

                  <GroupShoppingListDialog factoryIds={group.factoryIds} />

                  <EditGroupForm groupId={group.id} />

                  <DeleteDialog
                    onDelete={() =>
                      deleteFactoryGroup(playthrough.id, group.id)
                    }
                    title={tModals("deleteGroupTitle")}
                    description={tModals("deleteGroupDesc")}
                  />
                </div>
              </div>

              {group.factoryIds.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center">
                  <div className="bg-card rounded-md p-4">
                    <p>{t("factoryGroups.groupEmpty")}</p>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}

        {ungroupedFactoryIds && (
          <li className="w-full">
            <div
              className={cn(
                "border-muted rounded-lg border-2 p-4 transition-colors",
                hoveredGroup === "ungrouped" && "bg-accent/80 border-white",
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
              <span className="mb-6 inline-block font-semibold">
                {t("factoryGroups.ungroupedTitle")}
              </span>

              {ungroupedFactoryIds.length > 0 ? (
                <ul className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {ungroupedFactoryIds.map((factoryId) => (
                    <li
                      key={factoryId}
                      className={cn(
                        "w-full max-w-96 transition-colors",
                        hoveredGroup === "ungrouped" && "bg-accent/80",
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
              ) : (
                <div className="flex items-center justify-center">
                  <div className="bg-card rounded-md p-4">
                    <span>{t("factoryGroups.ungroupedEmpty")}</span>
                  </div>
                </div>
              )}
            </div>
          </li>
        )}
      </ul>
    </>
  );
};

export default FactoryCardOverview;
