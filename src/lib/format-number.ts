/**
 * Formats a number into a human-readable abbreviated form
 * @param num - The number to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted string (e.g., "10K", "1.5M", "2.3B")
 */
export function formatNumberToAbbreviation(
  num: number,
  decimals: number = 1
): string {
  if (num === 0) return "0";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["", "K", "M", "B", "T"];

  const i = Math.floor(Math.log(Math.abs(num)) / Math.log(k));

  if (i === 0) {
    return num.toString();
  }

  const formattedNum = parseFloat((num / Math.pow(k, i)).toFixed(dm));

  // Remove trailing zeros and decimal point if not needed
  const cleanNum =
    formattedNum % 1 === 0
      ? formattedNum.toString().split(".")[0]
      : formattedNum.toString();

  return cleanNum + sizes[i];
}

/**
 * Formats a currency amount with Philippine Peso symbol and abbreviation
 * @param amount - The amount to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted currency string (e.g., "₱10K", "₱1.5M")
 */
export function formatCurrencyAbbreviation(
  amount: number,
  decimals: number = 1
): string {
  return `₱${formatNumberToAbbreviation(amount, decimals)}`;
}
