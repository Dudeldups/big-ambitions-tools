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
  buttonText: string;
  modalText: string;
  onModalSubmit: () => void;
};

const CancelConfirmModal = ({
  buttonText,
  modalText,
  onModalSubmit,
}: CancelConfirmModalProps) => {
  const tGeneral = useTranslations("general");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:w-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{modalText}</DialogTitle>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tGeneral("close")}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                onModalSubmit();
              }}
            >
              {tGeneral("confirm")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmModal;
