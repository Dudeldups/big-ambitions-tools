import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ClipboardCheck } from "lucide-react";
import ImporterTable from "../tables/importer-table";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { mergeShoppingLists } from "@/lib/utils/mergeShoppingLists";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";
import { getMissingPalletShelvesTotal } from "@/lib/calculations/getMissingPalletShelvesTotal";
import { cn } from "@/lib/utils";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";

type GroupShoppingListDialogProps = {
  factoryIds: string[];
};

const GroupShoppingListDialog = ({
  factoryIds,
}: GroupShoppingListDialogProps) => {
  const { t, rich } = useRichDefaults();
  const { activePlaythrough } = useActivePlaythrough();
  const getFactoryById = usePlaythroughStore((s) => s.getFactoryById);

  const groupFactories = factoryIds.map((fId) => getFactoryById(fId));

  if (!groupFactories || !activePlaythrough) return null;
  const gameData = getPlaythroughGameData(activePlaythrough);

  const neededPalletShelvesTotal = getMissingPalletShelvesTotal(
    groupFactories,
    gameData,
  );

  const splitPerFactory = groupFactories.flatMap((factory) => {
    if (!factory) return [];

    return splitShoppingListByShelves(
      getShoppingList(factory, activePlaythrough.difficulty, gameData),
      getOptimalPalletShelfAmount(factory.workstations, gameData).external,
      factory.shelfAmount,
    ).externalList;
  });

  const groupShoppingList = mergeShoppingLists(splitPerFactory);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="foreground"
          className={cn(neededPalletShelvesTotal === 0 && "hidden")}
        >
          <ClipboardCheck className="size-5" />
          {t("tools.factoryGroups.shoppingList.title")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t("tools.factoryGroups.shoppingList.title")}
          </DialogTitle>
          <DialogDescription>
            {rich("tools.factoryGroups.shoppingList.desc", {
              amount: neededPalletShelvesTotal,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-6 overflow-auto xl:max-h-[75vh]">
          {groupShoppingList.map((list) => (
            <ImporterTable key={list.importer} data={list} t={t} />
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("general.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupShoppingListDialog;
