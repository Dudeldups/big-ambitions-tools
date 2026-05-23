import { useTranslations } from "next-intl";
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
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  MAX_PRODUCT_PRICE_INDEX,
  MIN_PRODUCT_PRICE_INDEX,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { usePriceIndices } from "@/lib/hooks/usePriceIndices";
import { assertPriceIndex } from "@/lib/utils/assertPriceIndex";
import { ProductName } from "@/lib/game/productNames";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { safeLog } from "@/lib/utils/safeLog";
import { getPlaythroughGameData } from "@/lib/game/registry";
import { Product } from "@/lib/game/types";

const PriceIndicesDialog = () => {
  const tGeneral = useTranslations("general");
  const tModals = useTranslations("modals");
  const tProducts = useTranslations("products");
  const tToasts = useTranslations("toasts");

  const { activePlaythrough } = useActivePlaythrough();
  const setPriceIndex = usePlaythroughStore((state) => state.setPriceIndex);
  const currentPriceIndices = usePriceIndices();

  const onIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activePlaythrough || !currentPriceIndices) return;

    const value = parseFloat(e.target.value);
    const productName = e.target.name as ProductName;

    try {
      assertPriceIndex(value);

      if (isNaN(value)) return;

      setPriceIndex(activePlaythrough.id, productName, value);
    } catch (error) {
      toast.error(tToasts("genericError"));
      safeLog(error, "Error updating price index with value: ", value);
    }
  };

  if (!activePlaythrough || !currentPriceIndices) return null;

  const gameData = getPlaythroughGameData(activePlaythrough);
  const productNames = (
    Object.entries(gameData.products) as [ProductName, Product | undefined][]
  )
    .filter(([, product]) => product && product.productSalesRatio > 0)
    .map(([name]) => name)
    .sort((a, b) => tProducts(a).localeCompare(tProducts(b)));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <SlidersHorizontal className="size-5" />
          {tGeneral("priceIndices")}
        </Button>
      </DialogTrigger>

      <DialogContent className="pb-0 sm:max-w-md">
        <DialogHeader className="">
          <DialogTitle>{tGeneral("priceIndices")}</DialogTitle>
          <DialogDescription>{tModals("priceIndicesDesc")}</DialogDescription>
        </DialogHeader>

        <form className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto pr-2 sm:max-h-[70vh]">
          <FieldGroup className="gap-0">
            {productNames.map((productName, index) => (
              <Field key={productName}>
                <FieldLabel htmlFor={productName} className="justify-between">
                  {tProducts(productName)}:
                  <span className="font-bold">
                    {currentPriceIndices[productName]?.toFixed(2)}
                  </span>
                </FieldLabel>
                <input
                  id={productName}
                  name={productName}
                  type="range"
                  min={MIN_PRODUCT_PRICE_INDEX}
                  max={MAX_PRODUCT_PRICE_INDEX}
                  step={0.01}
                  value={currentPriceIndices[productName]}
                  onChange={onIndexChange}
                  className={cn("accent-foreground w-full transition-opacity")}
                />

                {index !== productNames.length - 1 && (
                  <Separator className="my-3" />
                )}
              </Field>
            ))}
          </FieldGroup>
        </form>

        <DialogFooter className="bg-accent rounded-b-xl">
          <DialogClose asChild>
            <Button variant="outline">{tGeneral("cancel")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceIndicesDialog;
