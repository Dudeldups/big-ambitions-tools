"use client";

import { useTranslations } from "next-intl";
import Searchbar from "./Searchbar";
import { useMemo, useState } from "react";
import { products } from "@/lib/game/products";

const Table = () => {
  const t = useTranslations("database");
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
            aValue = a.importPrice.hard === 0 ? -1 : a.importPrice.hard;
            bValue = b.importPrice.hard === 0 ? -1 : b.importPrice.hard;
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
      <h2>{t("table.title")}</h2>

      <Searchbar />
      <table className="w-full border-collapse bg-gray-800 [&_td,&_th]:border-2 [&_td,&_th]:border-gray-600 [&_td,&_th]:px-3 [&_td,&_th]:py-1">
        <caption className="p-5">{t("table.caption")}</caption>

        <thead className="sticky -top-px bg-gray-900 text-left shadow-sm">
          <tr>
            <th scope="col">
              <button
                onClick={() => handleSort("itemName")}
                className="h-full w-full text-left"
              >
                {t("table.headers.name")}
              </button>
            </th>
            <th scope="col">
              <button
                onClick={() => handleSort("amountPerBox")}
                className="h-full w-full text-left"
              >
                {t("table.headers.amountPerBox")}
              </button>
            </th>
            <th scope="col">
              <button
                onClick={() => handleSort("importPrice")}
                className="h-full w-full text-left"
              >
                {t("table.headers.importPrice")}
              </button>
            </th>
            <th scope="col">
              <button
                onClick={() => handleSort("importers")}
                className="h-full w-full text-left"
              >
                {t("table.headers.importers")}
              </button>
            </th>
            <th scope="col">{t("table.headers.ingredients")}</th>
            <th scope="col">
              <button
                onClick={() => handleSort("productionRate")}
                className="h-full w-full text-left"
              >
                {t("table.headers.productionRate")}
              </button>
            </th>
            <th scope="col">
              <button
                onClick={() => handleSort("workstation")}
                className="h-full w-full text-left"
              >
                {t("table.headers.workstation")}
              </button>
            </th>
          </tr>
        </thead>

        <tbody className="align-top">
          {sortedProducts.map(([name, product]) => (
            <tr key={name} className="hocus:bg-gray-500 even:bg-gray-700">
              <th scope="row" className="text-left">
                {name}
              </th>
              <td className="amount">{product.amountPerBox}</td>
              <td className="amount">
                {product.importPrice.hard === 0
                  ? "-"
                  : product.importPrice.hard}
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
        </tbody>
      </table>
    </>
  );
};

export default Table;
