import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { WORKSTATION_PRESETS } from "@/lib/utils/workstationPresets";
import { UseFieldArrayAppend } from "react-hook-form";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useTranslations } from "next-intl";
import { products } from "@/lib/game/products";

type Props = {
  append: UseFieldArrayAppend<FactoryFormValues, "workstations">;
};

const WorkstationPresetDialog = ({ append }: Props) => {
  const t = useTranslations("workstationPresets");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add preset</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a preset</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {Object.entries(WORKSTATION_PRESETS).map(([key, productNames]) => (
            <Button
              key={key}
              variant="secondary"
              onClick={() => {
                const allWs = productNames.map((productName) => ({
                  amount: 1,
                  name: products[productName].workstation,
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
