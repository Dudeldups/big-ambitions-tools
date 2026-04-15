import { Translator } from "@/lib/types";
import SearchBar from "../search-bar";
import ColumnSelector from "./column-selector";
import DifficultyButtonGroup from "./difficulty-button-group";
import PriceIndexSlider from "./price-index-slider";
import SalesPriceSelector from "./sales-price-selector";
import { Table } from "@tanstack/react-table";
import { usePathname } from "@/i18n/navigation";
import { DesktopXl, Mobile, TabletToXl } from "@/lib/utils/mediaQueries";

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

      <Mobile>
        <div className="grid gap-4 py-4">
          <div className="flex flex-1 flex-wrap items-end gap-4">
            {isProductsPage && (
              <>
                <PriceIndexSlider className="mr-2" />
                <SalesPriceSelector className="flex-wrap gap-4" />
              </>
            )}

            {hasDifficultySelector && <DifficultyButtonGroup />}
          </div>

          <div className="flex gap-4">
            <SearchBar
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
      </Mobile>

      {/* Tablet */}

      <TabletToXl>
        <div className="grid gap-4 py-4">
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

            {hasDifficultySelector && <DifficultyButtonGroup />}

            <ColumnSelector className="ml-auto" table={table} />
          </div>
        </div>
      </TabletToXl>

      {/* Desktop */}

      <DesktopXl>
        <div className="flex flex-wrap items-end gap-4 py-4">
          <SearchBar
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

            {hasDifficultySelector && <DifficultyButtonGroup />}
          </div>

          <ColumnSelector className="" table={table} />
        </div>
      </DesktopXl>
    </>
  );
};

export default DataTableOptionsBar;
