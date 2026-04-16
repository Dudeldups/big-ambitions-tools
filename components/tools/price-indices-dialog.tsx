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
import { products } from "@/lib/game/products";
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

const productNames = Object.keys(products) as ProductName[];

const PriceIndicesDialog = () => {
  const tGeneral = useTranslations("general");
  const tModals = useTranslations("modals");
  const tProducts = useTranslations("products");
  const { activePlaythrough } = useActivePlaythrough();
  const setPriceIndex = usePlaythroughStore((state) => state.setPriceIndex);
  const currentPriceIndices = usePriceIndices();

  const onIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activePlaythrough || !currentPriceIndices) return;
    const value = parseFloat(e.target.value);
    assertPriceIndex(value);
    if (isNaN(value)) return;
    const productName = e.target.name as ProductName;

    setPriceIndex(activePlaythrough.id, productName, value);
  };

  if (!activePlaythrough || !currentPriceIndices) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="size-5" />
          {tGeneral("priceIndices")}
        </Button>
      </DialogTrigger>

      <DialogContent className="px-0 pb-0">
        <DialogHeader className="px-6">
          <DialogTitle>{tGeneral("priceIndices")}</DialogTitle>
          <DialogDescription>{tModals("priceIndicesDesc")}</DialogDescription>
        </DialogHeader>

        <form className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto px-6">
          <FieldGroup className="gap-0">
            {productNames
              .sort((a, b) => {
                return tProducts(a).localeCompare(tProducts(b));
              })
              .map((productName, index) => (
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
                    className={cn(
                      "accent-foreground w-full transition-opacity",
                    )}
                  />

                  {index !== productNames.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </Field>
              ))}
          </FieldGroup>
        </form>

        <DialogFooter className="bg-accent rounded-b-xl px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceIndicesDialog;
