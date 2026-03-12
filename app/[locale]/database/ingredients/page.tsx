"use client";

import { Ingredient, ingredients } from "@/lib/game/ingredients";
import { useTranslations } from "next-intl";
import Searchbar from "../_components/Searchbar";
import DatabaseTable from "../_components/DatabaseTable";
import DatabaseTableHead from "../_components/DatabaseTableHead";
import DatabaseTableBody from "../_components/DatabaseTableBody";
import { useSortableData } from "@/lib/hooks/useSortableData";

const Ingredients = () => {
  const t = useTranslations("database.table.ingredients");
  const tIngredients = useTranslations("ingredients");
  const difficulty = "hard"; // TODO: make this dynamic
  const ingredientEntries = Object.entries(ingredients);
  const ingredientHeaders = [
    "itemName",
    ...(Object.keys(
      ingredientEntries[0][1],
    ) as (keyof (typeof ingredientEntries)[0][1])[]),
  ];
  const accessors = {
    itemName: ([name]: [string, Ingredient]) => name,

    amountPerBox: ([, p]: [string, Ingredient]) => p.amountPerBox,

    importPrice: ([, p]: [string, Ingredient]) =>
      p.importPrice[difficulty] === 0 ? -1 : p.importPrice[difficulty],

    importers: ([, p]: [string, Ingredient]) => p.importers.length,
  };

  const {
    sortedData: sortedIngredients,
    sortConfig,
    requestSort,
  } = useSortableData(ingredientEntries, accessors, "itemName");

  return (
    <>
      <h2>{t("title")}</h2>

      <Searchbar />

      <DatabaseTable tableType="ingredients">
        <DatabaseTableHead>
          {ingredientHeaders.map((key) => {
            const headerKey = `headers.${key}`;
            return (
              <th key={key} scope="col">
                <button
                  className="flex items-center gap-2 text-left"
                  onClick={() => requestSort(key)}
                >
                  {t(headerKey)}
                  {sortConfig.field === key && (
                    <span aria-hidden="true">
                      {sortConfig?.field === key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </span>
                  )}
                </button>
              </th>
            );
          })}
        </DatabaseTableHead>

        <DatabaseTableBody>
          {sortedIngredients.map(([itemName, ingredient]) => (
            <tr key={itemName}>
              <th scope="row" className="text-left">
                {tIngredients(itemName)}
              </th>
              <td className="amount">{ingredient.amountPerBox}</td>
              <td className="amount">
                {ingredient.importPrice[difficulty] === 0
                  ? "-"
                  : ingredient.importPrice[difficulty].toFixed(2)}
              </td>
              <td>
                <ul>
                  {ingredient.importers.map((importer, i) => (
                    <li key={`${importer}-${i}`}>{importer}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </DatabaseTableBody>
      </DatabaseTable>
    </>
  );
};

export default Ingredients;
