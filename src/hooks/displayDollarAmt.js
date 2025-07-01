/**
 * Formats a numeric value as a currency string in USD
 *
 * @param {number|string} amount - The amount to format
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.alwaysShowCents=false] - Always show cents, even for whole numbers
 * @param {boolean} [options.showPlusSign=false] - Show plus sign for positive numbers
 * @param {string} [options.currency='USD'] - Currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param {string} [options.locale='en-US'] - Locale for formatting
 * @param {number} [options.maximumFractionDigits=2] - Maximum fraction digits to display
 * @param {string} [options.fallbackValue=''] - Value to return for invalid inputs
 * @param {string} [options.roundingMethod='round'] - Rounding method: 'round', 'floor', or 'ceil'
 * @param {boolean} [options.useGrouping=true] - Whether to use grouping separators (e.g., thousands)
 * @param {boolean} [options.abbreviate=false] - Whether to abbreviate large numbers (e.g., $1.2M)
 * @returns {string} Formatted currency string or fallback value for invalid inputs
 */
function displayDollarAmt(amount, options = {}) {
  // Set default options
  const opts = {
    alwaysShowCents: false,
    showPlusSign: false,
    currency: "USD",
    locale: "en-US",
    maximumFractionDigits: 2,
    fallbackValue: "",
    roundingMethod: "round",
    useGrouping: true,
    abbreviate: false,
    ...options,
  };

  // Check for invalid inputs
  if (
    amount === null ||
    amount === undefined ||
    isNaN(amount) ||
    (typeof amount === "string" &&
      !/^-?\d*\.?\d+(?:[Ee][+-]?\d+)?$/.test(amount))
  ) {
    return opts.fallbackValue;
  }

  // Parse the amount
  let parsedAmount = parseFloat(amount);

  // Apply rounding method if specified
  if (opts.roundingMethod === "floor") {
    const factor = Math.pow(10, opts.maximumFractionDigits);
    parsedAmount = Math.floor(parsedAmount * factor) / factor;
  } else if (opts.roundingMethod === "ceil") {
    const factor = Math.pow(10, opts.maximumFractionDigits);
    parsedAmount = Math.ceil(parsedAmount * factor) / factor;
  }

  // Handle abbreviation for large numbers
  if (opts.abbreviate) {
    const absAmount = Math.abs(parsedAmount);
    let abbrevValue, suffix;

    if (absAmount >= 1e9) {
      abbrevValue = parsedAmount / 1e9;
      suffix = "B";
    } else if (absAmount >= 1e6) {
      abbrevValue = parsedAmount / 1e6;
      suffix = "M";
    } else if (absAmount >= 1e3) {
      abbrevValue = parsedAmount / 1e3;
      suffix = "K";
    } else {
      abbrevValue = parsedAmount;
      suffix = "";
    }

    if (suffix) {
      // Format with appropriate decimal places
      const formatOptions = {
        style: "currency",
        currency: opts.currency,
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
        useGrouping: opts.useGrouping,
      };

      let formattedValue = abbrevValue.toLocaleString(
        opts.locale,
        formatOptions
      );

      // Add plus sign for positive numbers if requested
      if (opts.showPlusSign && parsedAmount > 0) {
        formattedValue = "+" + formattedValue;
      }

      // Add suffix
      return formattedValue + suffix;
    }
  }

  // Determine if this is a whole number
  const isWholeNumber = parsedAmount % 1 === 0;

  // Set formatting options
  const formatOptions = {
    style: "currency",
    currency: opts.currency,
    minimumFractionDigits:
      opts.alwaysShowCents || !isWholeNumber
        ? Math.min(opts.maximumFractionDigits, 2)
        : 0,
    maximumFractionDigits: opts.maximumFractionDigits,
    useGrouping: opts.useGrouping,
  };

  // Format the amount
  let formattedAmount = parsedAmount.toLocaleString(opts.locale, formatOptions);

  // Add plus sign for positive numbers if requested
  if (opts.showPlusSign && parsedAmount > 0) {
    formattedAmount = "+" + formattedAmount;
  }

  return formattedAmount;
}

export default displayDollarAmt;
