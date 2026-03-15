export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatToUSD = (value: number) => usdFormatter.format(value);
