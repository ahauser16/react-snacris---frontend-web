/**
 * Formats a date into a human-readable string
 *
 * @param {Date|string|number} date - The date to format (Date object, ISO string, or timestamp)
 * @param {Object} [customOptions] - Formatting options (follows Intl.DateTimeFormat options)
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} The formatted date string or error message for invalid dates
 */
function displayDateTime(date, customOptions = null, locale = "en-US") {
  try {
    // Default options for date formatting
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Use custom options if provided, otherwise use defaults
    const options = customOptions || defaultOptions;

    // Handle ISO date strings by creating a date object that respects the exact date
    if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}/)) {
      // For ISO strings like "2023-07-22", create a date that definitely represents that day
      // by explicitly setting the year, month, day in local time zone
      const [year, month, day] = date.split("T")[0].split("-").map(Number);
      return new Intl.DateTimeFormat(locale, options).format(
        new Date(year, month - 1, day)
      );
    }

    // Handle timestamps or Date objects
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error formatting date";
  }
}

export default displayDateTime;
