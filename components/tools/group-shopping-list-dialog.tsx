import { useTranslations } from "next-intl";
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
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { mergeShoppingLists } from "@/lib/utils/mergeShoppingLists";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";

type GroupShoppingListDialogProps = {
  factoryIds: string[];
};

const GroupShoppingListDialog = ({
  factoryIds,
}: GroupShoppingListDialogProps) => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const getFactoryById = usePlaythroughStore((s) => s.getFactoryById);

  const groupFactories = factoryIds.map((fId) => getFactoryById(fId));

  if (!groupFactories || !activePlaythrough) return null;

  const neededPalletShelvesTotal = groupFactories.reduce(
    (acc, f) =>
      f
        ? acc +
          (getOptimalPalletShelfAmount(f.workstations).weekly - f.shelfAmount)
        : acc,
    0,
  );

  const splitPerFactory = groupFactories.flatMap((factory) => {
    if (!factory) return [];

    return splitShoppingListByShelves(
      getShoppingList(factory, activePlaythrough.difficulty),
      getOptimalPalletShelfAmount(factory.workstations).weekly,
      factory.shelfAmount,
    ).externalList;
  });

  const groupShoppingList = mergeShoppingLists(splitPerFactory);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ClipboardCheck className="size-5" />
          Group shopping list
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Group shopping list</DialogTitle>
          <DialogDescription>
            These are all ingredients that are needed to supply those factories
            without enough pallet shelves inside this group. It calculates based
            on the amount of shelves available in the factories so you can order
            the rest to a separate warehouse.
            <br />
            Shelves needed in this warehouse:{" "}
            <strong>{neededPalletShelvesTotal}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-6 overflow-auto lg:max-h-[75vh]">
          {groupShoppingList.map((list) => (
            <ImporterTable key={list.importer} data={list} t={t} />
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>{t("general.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupShoppingListDialog;
