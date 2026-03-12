"use client";

import { useTranslations } from "next-intl";
import Searchbar from "../_components/Searchbar";
import { Product, products } from "@/lib/game/products";
import DatabaseTable from "../_components/DatabaseTable";
import DatabaseTableHead from "../_components/DatabaseTableHead";
import DatabaseTableBody from "../_components/DatabaseTableBody";
import { useMemo, useState } from "react";

const Products = () => {
  const t = useTranslations("database.table.products");
  const tProducts = useTranslations("products");
  const difficulty = "hard"; // TODO: make this dynamic
  const productEntries = Object.entries(products);
  const productHeaders = [
    "itemName",
    ...(Object.keys(productEntries[0][1]) as (keyof Product)[]),
  ];
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({ field: "itemName", direction: "asc" });

  const sortedProducts = useMemo(() => {
    const sortableProducts = Object.entries(products);

    if (sortConfig) {
      sortableProducts.sort(([aName, a], [bName, b]) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortConfig.field) {
          case "itemName":
            aValue = aName;
            bValue = bName;
            break;
          case "amountPerBox":
            aValue = a.amountPerBox;
            bValue = b.amountPerBox;
            break;
          case "importPrice":
            aValue =
              a.importPrice[difficulty] === 0 ? -1 : a.importPrice[difficulty];
            bValue =
              b.importPrice[difficulty] === 0 ? -1 : b.importPrice[difficulty];
            break;
          case "importers":
            aValue = a.importers.length;
            bValue = b.importers.length;
            break;
          case "productionRate":
            aValue = a.productionRate;
            bValue = b.productionRate;
            break;
          case "workstation":
            aValue = a.workstation;
            bValue = b.workstation;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableProducts;
  }, [sortConfig]);

  const handleSort = (field: string) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

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
                  onClick={() => handleSort(key)}
                  className="h-full w-full text-left"
                >
                  {t(headerKey)}
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
              <td className="amount">
                {product.importPrice[difficulty] === 0
                  ? "-"
                  : product.importPrice[difficulty]}
              </td>
              <td className="amount">{product.amountPerBox}</td>
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
