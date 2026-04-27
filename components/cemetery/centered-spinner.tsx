import { Spinner } from "../ui/spinner";

const CenteredSpinner = () => {
  return (
    <div className="grid place-items-center p-10">
      <Spinner className="size-6" />
    </div>
  );
};

export default CenteredSpinner;
