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
import DeliveriesTable from "../tables/deliveries-table";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { calculateDailyWarehouseSupply } from "@/lib/calculations/calculateDailyWarehouseSupply";
import { splitShoppingListByShelves } from "@/lib/utils/splitShoppingListByShelves";

type GroupDeliveriesDialogProps = {
  factoryIds: string[];
};

const GroupDeliveriesDialog = ({ factoryIds }: GroupDeliveriesDialogProps) => {
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

  const deliveryLists = groupFactories.flatMap((factory) => {
    if (!factory) return [];
    const shoppingList = getShoppingList(factory, activePlaythrough.difficulty);
    const requiredShelves = getOptimalPalletShelfAmount(
      factory.workstations,
    ).weekly;
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
        <Button variant="outline">
          <Package className="size-5" />
          Deliveries
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delivery plan</DialogTitle>
          <DialogDescription>
            Delivery plans for each factory in this group. You will need{" "}
            {neededPalletShelvesTotal} pallet shelves to supply all factories.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-6 overflow-auto lg:max-h-[75vh]">
          {deliveryLists.map((item, i) => (
            <DeliveriesTable
              key={item.destination + i}
              destination={item.destination}
              deliveryList={item.deliveryList}
              t={t}
            />
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
