import { EXPORT_PRICE_MULT, PUBLIC_PRICE_MULT } from "./../constants";
import { IMPORT_PRICE_BASE_MULT } from "../constants";
import { Difficulty } from "../game/types";

export const getImportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
) => {
  return (
    wholesalePrice * IMPORT_PRICE_BASE_MULT * PUBLIC_PRICE_MULT[difficulty]
  );
};

export const getExportPrice = (
  wholesalePrice: number,
  difficulty: Difficulty,
) => {
  return (
    wholesalePrice *
    PUBLIC_PRICE_MULT[difficulty] *
    EXPORT_PRICE_MULT[difficulty]
  );
};
