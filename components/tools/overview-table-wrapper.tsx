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
      <h3 className="text-center text-xl font-semibold capitalize md:text-2xl">
        {title}
      </h3>

      <InfoTable label={label} rows={rowData} />
    </div>
  );
};

export default OverviewTableWrapper;
