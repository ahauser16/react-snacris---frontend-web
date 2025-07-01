/**
 * Formats a numeric value as a percentage string
 *
 * @param {number|string} percentage - The percentage value to format
 * @param {Object} [options] - Formatting options
 * @param {number} [options.precision=0] - Number of decimal places to display
 * @param {boolean} [options.showPlusSign=false] - Show plus sign for positive numbers
 * @param {boolean} [options.useParentheses=false] - Use parentheses for negative values instead of minus sign
 * @param {string} [options.fallbackValue='N/A'] - Value to return for invalid inputs
 * @param {boolean} [options.trimZeros=true] - Whether to trim trailing zeros in decimal part
 * @returns {string} Formatted percentage string or fallback value for invalid inputs
 */
function displayPercentage(percentage, options = {}) {
  // Set default options
  const opts = {
    precision: 0,
    showPlusSign: false,
    useParentheses: false,
    fallbackValue: "N/A",
    trimZeros: true,
    ...options,
  };

  // Check for invalid inputs
  if (
    percentage === null ||
    percentage === undefined ||
    (typeof percentage === "string" &&
      !/^-?\d*\.?\d+(?:[Ee][+-]?\d+)?$/.test(percentage))
  ) {
    return opts.fallbackValue;
  }

  // Parse the percentage value
  const parsedValue = Number(percentage);

  // Handle NaN after conversion
  if (isNaN(parsedValue)) {
    return opts.fallbackValue;
  }

  // Format the percentage with the specified precision
  let formattedValue = parsedValue.toFixed(opts.precision);

  // Trim trailing zeros if requested
  if (opts.trimZeros && opts.precision > 0 && formattedValue.includes(".")) {
    formattedValue = parsedValue.toFixed(opts.precision).replace(/\.?0+$/, "");
  }

  // Format with appropriate sign
  if (parsedValue < 0) {
    if (opts.useParentheses) {
      // Remove the minus sign and wrap in parentheses
      formattedValue = `(${formattedValue.replace("-", "")})`;
    }
    // else: keep the negative sign that's already there
  } else if (parsedValue > 0 && opts.showPlusSign) {
    formattedValue = `+${formattedValue}`;
  }

  // Add the percentage symbol
  return `${formattedValue}%`;
}

export default displayPercentage;
