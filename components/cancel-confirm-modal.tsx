import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type CancelConfirmModalProps = {
  onModalSubmit: () => void;
};

const CancelConfirmModal = ({ onModalSubmit }: CancelConfirmModalProps) => {
  const tGeneral = useTranslations("general");
  const tModals = useTranslations("modals");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {tGeneral("cancel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:w-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{tModals("discardChanges")}</DialogTitle>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tGeneral("close")}
            </Button>
          </DialogClose>

          <Button type="button" onClick={onModalSubmit}>
            {tGeneral("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmModal;
