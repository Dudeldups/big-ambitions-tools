"use client";

import { Translator } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const IngredientsCell = ({
  ingredients,
  t,
}: {
  ingredients: Record<string, number>[];
  t: Translator;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!ingredients || ingredients.length === 0) return "-";

  const visibleIngredients = isExpanded ? ingredients : ingredients.slice(0, 1);
  const hasMoreThanOne = ingredients.length > 1;

  return (
    <div className="flex items-start justify-between gap-1">
      <ul>
        {visibleIngredients.map((ingredient, index) => {
          const [name, amount] = Object.entries(ingredient)[0];
          return (
            <li className="not-first:pt-1" key={index}>
              {amount} x {t(`ingredients.${name}`)}
            </li>
          );
        })}
      </ul>

      {hasMoreThanOne && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className="text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
          aria-label={isExpanded ? "Show less" : "Show more"}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
};

export default IngredientsCell;
