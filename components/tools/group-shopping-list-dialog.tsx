import { useState } from "react";
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
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { ClipboardCheck } from "lucide-react";
import ImporterTable from "../tables/importer-table";
import NoDataFound from "../no-data-found";
import { getShoppingList, ImporterShoppingList } from "@/lib/utils/getShoppingList";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { mergeShoppingLists } from "@/lib/utils/mergeShoppingLists";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";
import { getMissingPalletShelvesTotal } from "@/lib/calculations/getMissingPalletShelvesTotal";
import { useRichDefaults } from "@/lib/hooks/useRichDefaults";

type GroupShoppingListDialogProps = {
  factoryIds: string[];
};

const GroupShoppingListDialog = ({
  factoryIds,
}: GroupShoppingListDialogProps) => {
  const [useFactoryShelves, setUseFactoryShelves] = useState(true);
  const { t, rich } = useRichDefaults();
  const { activePlaythrough } = useActivePlaythrough();
  const getFactoryById = usePlaythroughStore((s) => s.getFactoryById);

  const groupFactories = factoryIds.map((fId) => getFactoryById(fId));

  if (!groupFactories || !activePlaythrough) return null;
  const gameData = getPlaythroughGameData(activePlaythrough);

  const neededPalletShelvesTotal = getMissingPalletShelvesTotal(
    groupFactories,
    gameData,
    useFactoryShelves,
  );

  const splitPerFactory = groupFactories.flatMap((factory) => {
    if (!factory) return [];

    return splitShoppingListByShelves(
      getShoppingList(factory, activePlaythrough.difficulty, gameData),
      getOptimalPalletShelfAmount(factory.workstations, gameData).external,
      factory.shelfAmount,
      gameData,
      useFactoryShelves,
    ).externalList;
  });

  const groupShoppingList = mergeShoppingLists(splitPerFactory).sort(
    (a: ImporterShoppingList, b: ImporterShoppingList) =>
      a.importer.localeCompare(b.importer),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="foreground">
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
          <Field orientation="horizontal" className="w-auto items-center">
            <Checkbox
              id="group-shopping-list-factory-shelves"
              checked={useFactoryShelves}
              onCheckedChange={(checked) =>
                setUseFactoryShelves(checked !== false)
              }
            />
            <FieldLabel
              htmlFor="group-shopping-list-factory-shelves"
              className="cursor-pointer text-sm font-normal"
            >
              {t("tools.factoryGroups.shoppingList.useFactoryShelves")}
            </FieldLabel>
          </Field>
        </DialogHeader>

        {groupShoppingList.length > 0 ? (
          <div className="max-h-[50vh] space-y-6 overflow-auto xl:max-h-[75vh]">
            {groupShoppingList.map((list) => (
              <ImporterTable key={list.importer} data={list} t={t} />
            ))}
          </div>
        ) : (
          <NoDataFound
            text={t("tools.factoryGroups.shoppingList.noWarehouseRequired")}
          />
        )}

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
