import { Translator } from "@/lib/types";
import SearchBar from "../search-bar";
import ColumnSelector from "./column-selector";
import DifficultyButtonGroup from "./difficulty-button-group";
import PriceIndexSlider from "./price-index-slider";
import SalesPriceSelector from "./sales-price-selector";
import { Table } from "@tanstack/react-table";
import { usePathname } from "@/i18n/navigation";

type DataTableOptionsBarProps<TData> = {
  t: Translator;
  table: Table<TData>;
};

const DataTableOptionsBar = <TData,>({
  t,
  table,
}: DataTableOptionsBarProps<TData>) => {
  const pathname = usePathname();
  const isProductsPage = pathname === "/database/products";
  const hasDifficultySelector =
    pathname === "/database/ingredients" || pathname === "/database/products";

  return (
    <div className="flex items-end py-4">
      <SearchBar
        label={t("general.filterResults")}
        id="search"
        className="mr-auto"
        placeholder={t("general.filterResults")}
        value={(table.getColumn("itemName")?.getFilterValue() as string) ?? ""}
        onChange={(value) => table.getColumn("itemName")?.setFilterValue(value)}
      />

      {isProductsPage && (
        <>
          <PriceIndexSlider className="mx-auto" />
          <SalesPriceSelector />
        </>
      )}

      {hasDifficultySelector && <DifficultyButtonGroup className="mx-6" />}

      <ColumnSelector table={table} />
    </div>
  );
};

export default DataTableOptionsBar;
