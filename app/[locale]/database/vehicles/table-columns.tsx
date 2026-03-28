import {
  createBooleanColumn,
  createCurrencyColumn,
  createNumericColumn,
  createTranslatedColumn,
} from "@/components/tables/shared-table-columns";
import TableHeadContent from "@/components/tables/table-head-content";
import { VehicleName } from "@/lib/game/vehicleNames";
import { Vehicle } from "@/lib/game/vehicles";
import { getMeta } from "@/lib/utils/getMeta";
import { ColumnDef } from "@tanstack/react-table";

export type VehiclesColumnData = Vehicle & {
  itemName: VehicleName;
};

export const vehiclesColumns: ColumnDef<VehiclesColumnData>[] = [
  createTranslatedColumn("itemName", "vehicles"),
  createNumericColumn("maxSpeed"),
  createNumericColumn("enginePower"),
  createNumericColumn("maxFuel"),
  createNumericColumn("maxCargoCapacity"),
  createNumericColumn("requiredDeliveryDriverSkillValue"),
  createNumericColumn("destinationsThatCanDeliver"),
  {
    id: "destinationsFull",
    accessorFn: (row) => row.destinationsThatCanDeliver * 2,
    header: ({ column, table }) => {
      const { t } = getMeta(table);

      return (
        <TableHeadContent column={column} align="end">
          {t("tableColumns.destinationsFull")}
        </TableHeadContent>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value ?? "-";
    },
    meta: {
      align: "right",
    },
  },
  createCurrencyColumn("purchasePrice"),
  createBooleanColumn("autoParkSupported"),
  createBooleanColumn("taxDeductible"),
];
