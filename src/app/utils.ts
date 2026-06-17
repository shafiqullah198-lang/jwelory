/**
 * Reusable currency formatter for Pakistani Rupees (PKR)
 */
export function formatCurrency(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "";
  const num = typeof price === "number" ? price : parseFloat(price);
  if (isNaN(num)) return "Rs. 0";
  return `Rs. ${Math.round(num).toLocaleString()}`;
}
