import { Spinner } from "../ui/spinner";

const CenteredSpinner = () => {
  return (
    <div className="grid place-items-center py-20">
      <Spinner className="size-6" />
    </div>
  );
};

export default CenteredSpinner;
