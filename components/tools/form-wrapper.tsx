import { UseFormReturn, useWatch } from "react-hook-form";
import CreateFactoryForm from "./create-factory-form";
import FactoryOverview from "./factory-overview";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { useDerivedEmployees } from "@/lib/hooks/useDerivedEmployees";

type FormWrapperProps = {
  form: UseFormReturn<FactoryFormValues>;
  onSubmit: (values: FactoryFormValues) => void;
  onCancel: () => void;
};

const FormWrapper = ({ form, onSubmit, onCancel }: FormWrapperProps) => {
  const { control, setValue } = form;

  const [workstations, openingHours, vehicles, employees] = useWatch({
    control,
    name: ["workstations", "openingHours", "vehicles", "employees"],
  });

  useDerivedEmployees({
    workstations,
    openingHours,
    vehicles,
    employees,
    setValue,
  });

  const watchedValues = useWatch({ control }) as FactoryFormValues;

  return (
    <div className="@container/form-wrapper grid gap-8 xl:grid-cols-2">
      <CreateFactoryForm form={form} onSubmit={onSubmit} onCancel={onCancel} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default FormWrapper;
