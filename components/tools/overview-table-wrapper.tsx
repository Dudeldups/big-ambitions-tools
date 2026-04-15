import { DerivedDataFromFormValues } from "@/lib/calculations/derivedFactoryData";
import InfoTable from "../tables/info-table";

type OverviewTableWrapperProps = {
  title: string;
  label: string;
  rowData: DerivedDataFromFormValues;
};

const OverviewTableWrapper = ({
  title,
  label,
  rowData,
}: OverviewTableWrapperProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-center font-semibold capitalize">{title}</h2>

      <InfoTable label={label} rows={rowData} />
    </div>
  );
};

export default OverviewTableWrapper;
