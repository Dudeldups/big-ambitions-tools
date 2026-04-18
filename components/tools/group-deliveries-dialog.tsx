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
import { Package } from "lucide-react";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { getOptimalPalletShelfAmount } from "@/lib/calculations/getOptimalPalletShelfAmount";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { calculateDailyWarehouseSupply } from "@/lib/calculations/calculateDailyWarehouseSupply";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";
import { getMissingPalletShelvesTotal } from "@/lib/calculations/getMissingPalletShelvesTotal";
import { cn } from "@/lib/utils";
import DeliveriesTable from "../tables/deliveries-table";
import Details from "../details";

type GroupDeliveriesDialogProps = {
  factoryIds: string[];
};

const GroupDeliveriesDialog = ({ factoryIds }: GroupDeliveriesDialogProps) => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const getFactoryById = usePlaythroughStore((s) => s.getFactoryById);

  const groupFactories = factoryIds.map((fId) => getFactoryById(fId));

  if (!groupFactories || !activePlaythrough) return null;

  const neededPalletShelvesTotal = getMissingPalletShelvesTotal(groupFactories);

  const deliveryLists = groupFactories.flatMap((factory) => {
    if (!factory) return [];
    const shoppingList = getShoppingList(factory, activePlaythrough.difficulty);
    const requiredShelves = getOptimalPalletShelfAmount(
      factory.workstations,
    ).weekly;
    if (factory.shelfAmount > requiredShelves) return [];

    const { factoryList } = splitShoppingListByShelves(
      shoppingList,
      requiredShelves,
      factory.shelfAmount,
    );

    return {
      destination: factory.name,
      deliveryList: calculateDailyWarehouseSupply(factoryList),
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(neededPalletShelvesTotal === 0 && "hidden")}
        >
          <Package className="size-5" />
          Deliveries
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delivery plan</DialogTitle>
          <DialogDescription>
            {neededPalletShelvesTotal > 0 ? (
              <>
                Delivery plans for each factory in this group. You will need{" "}
                {neededPalletShelvesTotal} pallet shelves to supply all
                factories.
              </>
            ) : (
              <>
                All factories have enough shelves to hold all needed
                ingredients.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto lg:max-h-[75vh]">
          {deliveryLists.length > 0 &&
            deliveryLists.map((item, i) => (
              <Details
                key={`${item.destination}-${i}`}
                title={item.destination}
              >
                <DeliveriesTable deliveryList={item.deliveryList} t={t} />
              </Details>
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

export default GroupDeliveriesDialog;
