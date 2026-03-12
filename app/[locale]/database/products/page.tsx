"use client";

import { useTranslations } from "next-intl";
import Searchbar from "../_components/Searchbar";
import { Product, products } from "@/lib/game/products";
import DatabaseTable from "../_components/DatabaseTable";
import DatabaseTableHead from "../_components/DatabaseTableHead";
import DatabaseTableBody from "../_components/DatabaseTableBody";
import { useSortableData } from "@/lib/hooks/useSortableData";

const Products = () => {
  const t = useTranslations("database.table.products");
  const tProducts = useTranslations("products");
  const difficulty = "hard"; // TODO: make this dynamic
  const productEntries = Object.entries(products);
  const productHeaders = [
    "itemName",
    ...(Object.keys(productEntries[0][1]) as (keyof Product)[]),
  ];
  const accessors = {
    itemName: ([name]: [string, Product]) => name,

    amountPerBox: ([, p]: [string, Product]) => p.amountPerBox,

    importPrice: ([, p]: [string, Product]) =>
      p.importPrice[difficulty] === 0 ? -1 : p.importPrice[difficulty],

    importers: ([, p]: [string, Product]) => p.importers.length,

    ingredients: ([, p]: [string, Product]) => p.ingredients.length,

    productionRate: ([, p]: [string, Product]) => p.productionRate,

    workstation: ([, p]: [string, Product]) => p.workstation,
  };

  const {
    sortedData: sortedProducts,
    sortConfig,
    requestSort,
  } = useSortableData(productEntries, accessors, "itemName");

  return (
    <>
      <h2>{t("title")}</h2>

      <Searchbar />

      <DatabaseTable tableType="products">
        <DatabaseTableHead>
          {productHeaders.map((key) => {
            const headerKey = `headers.${key}`;
            return (
              <th key={key} scope="col">
                <button
                  className="flex w-full items-center gap-2 text-left"
                  onClick={() => requestSort(key)}
                >
                  {t(headerKey)}
                  {sortConfig.field === key && (
                    <span aria-hidden="true">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              </th>
            );
          })}
        </DatabaseTableHead>

        <DatabaseTableBody>
          {sortedProducts.map(([itemName, product]) => (
            <tr key={itemName}>
              <th scope="row" className="text-left">
                {tProducts(itemName)}
              </th>
              <td className="amount">{product.amountPerBox}</td>
              <td className="amount">
                {product.importPrice[difficulty] === 0
                  ? "-"
                  : product.importPrice[difficulty].toFixed(2)}
              </td>
              <td>
                <ul>
                  {product.importers.map((importer, i) => (
                    <li key={`${importer}-${i}`}>{importer}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {product.ingredients.map((ingredient, i) =>
                    Object.entries(ingredient).map(([name, amount]) => (
                      <li key={`${name}-${i}`}>
                        {amount} x {name}
                      </li>
                    )),
                  )}
                </ul>
              </td>
              <td className="amount">{product.productionRate}</td>
              <td>{product.workstation}</td>
            </tr>
          ))}
        </DatabaseTableBody>
      </DatabaseTable>
    </>
  );
};

export default Products;
