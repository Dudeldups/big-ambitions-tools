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
import { getFactorySupplyPlan } from "@/lib/utils/getFactorySupplyPlan";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { calculateDailyWarehouseSupply } from "@/lib/calculations/calculateDailyWarehouseSupply";
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
  const gameData = getPlaythroughGameData(activePlaythrough);

  const neededPalletShelvesTotal = getMissingPalletShelvesTotal(
    groupFactories,
    gameData,
    activePlaythrough.difficulty,
  );

  const deliveryLists = groupFactories.flatMap((factory) => {
    if (!factory) return [];
    const { warehouseList } = getFactorySupplyPlan(
      factory,
      activePlaythrough.difficulty,
      gameData,
    );

    if (warehouseList.length === 0) return [];

    return {
      destination: factory.name,
      deliveryList: calculateDailyWarehouseSupply(warehouseList),
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="foreground"
          className={cn(deliveryLists.length === 0 && "hidden")}
        >
          <Package className="size-5" />
          {t("tools.factoryGroups.deliveries.buttonDesc")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("tools.factoryGroups.deliveries.title")}</DialogTitle>
          <DialogDescription>
            {t("tools.factoryGroups.warehouseDeliveryDesc")}
            <br />
            {t("tools.factoryGroups.warehouseShelvesLabel")}{" "}
            <strong>{neededPalletShelvesTotal}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto xl:max-h-[75vh]">
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
            <Button variant="outline">{t("general.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDeliveriesDialog;
