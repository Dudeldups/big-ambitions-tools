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
import InfoTable from "../tables/info-table";
import { DerivedDataFromFormValues } from "@/lib/calculations/derivedFactoryData";
import { ClipboardCheck } from "lucide-react";

type OneTimeCostDialogProps = {
  rows: DerivedDataFromFormValues;
};

const OneTimeCostDialog = ({ rows }: OneTimeCostDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ClipboardCheck className="size-5" />
          One-time costs
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>One-time costs</DialogTitle>
          <DialogDescription>One-time costs for the factory</DialogDescription>
        </DialogHeader>

        <div className="no-scrollbar max-h-[60vh] overflow-auto">
          <InfoTable label="itemName" rows={rows} />
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

export default OneTimeCostDialog;
