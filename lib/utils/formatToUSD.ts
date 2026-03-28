export const usdFormatterWithCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const usdFormatterRounded = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number to USD.
 * @param value The number to format
 * @param hideCents Optional: if true, remove cents
 */

export const formatToUSD = (value: number, hideCents = false) => {
  if (hideCents) {
    return usdFormatterRounded.format(value);
  } else {
    return usdFormatterWithCents.format(value);
  }
};
