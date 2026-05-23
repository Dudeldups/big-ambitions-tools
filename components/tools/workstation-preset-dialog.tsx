import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { WORKSTATION_PRESETS } from "@/lib/utils/workstationPresets";
import { UseFieldArrayAppend } from "react-hook-form";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useTranslations } from "next-intl";
import { Product } from "@/lib/game/types";
import { ProductName } from "@/lib/game/productNames";

type Props = {
  append: UseFieldArrayAppend<FactoryFormValues, "workstations">;
  productsByName: Partial<Record<ProductName, Product>>;
};

const WorkstationPresetDialog = ({ append, productsByName }: Props) => {
  const t = useTranslations("workstationPresets");
  const tModals = useTranslations("modals");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{tModals("wsPresetBtn")}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tModals("wsPresetTitle")}</DialogTitle>
          <DialogDescription>{tModals("wsPresetDesc")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {Object.entries(WORKSTATION_PRESETS).map(([key, productNames]) => (
            <Button
              key={key}
              variant="secondary"
              onClick={() => {
                const allWs = productNames.map((productName) => ({
                  amount: 1,
                  name: productsByName[productName]!.workstation,
                  product: productName,
                }));
                append(allWs);
                setIsOpen(false);
              }}
            >
              {t(key)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkstationPresetDialog;
