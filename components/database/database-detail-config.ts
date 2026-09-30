export const DATABASE_DETAIL_CONFIG = {
  product: {
    namespace: "products",
    overview: "/database/products",
  },
  ingredient: {
    namespace: "ingredients",
    overview: "/database/ingredients",
  },
  workstation: {
    namespace: "workstations",
    overview: "/database/machines#workstations",
  },
} as const;

export type DetailKind = keyof typeof DATABASE_DETAIL_CONFIG;
