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
    <>
      {/* Mobile */}

      <div className="grid gap-4 py-4 md:hidden">
        <div className="flex flex-1 flex-wrap items-end gap-4">
          {isProductsPage && (
            <>
              <PriceIndexSlider className="mr-2" />
              <SalesPriceSelector className="flex-wrap gap-4" />
            </>
          )}

          {hasDifficultySelector && <DifficultyButtonGroup className="" />}
        </div>

        <div className="flex gap-4">
          <SearchBar
            className=""
            label={t("general.filterResults")}
            id="search"
            placeholder={t("general.filterResults")}
            value={
              (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
            }
            onChange={(value) =>
              table.getColumn("itemName")?.setFilterValue(value)
            }
          />

          <ColumnSelector className="ml-auto" table={table} />
        </div>
      </div>

      {/* Tablet */}

      <div className="hidden gap-4 py-4 md:max-xl:grid">
        <div className="flex flex-1 items-end gap-4">
          {isProductsPage && (
            <>
              <PriceIndexSlider className="mr-2" />
              <SalesPriceSelector className="gap-4" />
            </>
          )}
        </div>

        <div className="flex gap-4">
          <SearchBar
            className=""
            label={t("general.filterResults")}
            id="search"
            placeholder={t("general.filterResults")}
            value={
              (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
            }
            onChange={(value) =>
              table.getColumn("itemName")?.setFilterValue(value)
            }
          />

          {hasDifficultySelector && <DifficultyButtonGroup className="" />}

          <ColumnSelector className="ml-auto" table={table} />
        </div>
      </div>

      {/* Desktop */}

      <div className="hidden flex-wrap items-end gap-4 py-4 xl:flex">
        <SearchBar
          className=""
          label={t("general.filterResults")}
          id="search"
          placeholder={t("general.filterResults")}
          value={
            (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
          }
          onChange={(value) =>
            table.getColumn("itemName")?.setFilterValue(value)
          }
        />

        <div className="flex flex-1 items-end gap-4">
          {isProductsPage && (
            <>
              <PriceIndexSlider className="mx-2" />
              <SalesPriceSelector className="gap-4" />
            </>
          )}

          {hasDifficultySelector && <DifficultyButtonGroup className="" />}
        </div>

        <ColumnSelector className="" table={table} />
      </div>
    </>
  );
};

export default DataTableOptionsBar;
