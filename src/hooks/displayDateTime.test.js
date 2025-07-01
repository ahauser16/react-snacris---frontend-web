import displayDateTime from "./displayDateTime";

describe("displayDateTime", () => {
  // Test for valid date formatting
  test("formats date correctly", () => {
    // Using a fixed date (April 15, 2022)
    const testDate = new Date(2022, 3, 15);
    const result = displayDateTime(testDate);
    expect(result).toBe("April 15, 2022");
  });

  // Test with a date string (ISO format)
  test("handles ISO date strings", () => {
    const dateString = "2023-07-22";
    const result = displayDateTime(dateString);
    expect(result).toBe("July 22, 2023");
  });

  // Test with a timestamp (milliseconds since epoch)
  test("handles timestamps", () => {
    // Note: This is adjusted to account for timezone handling
    const timestamp = new Date(2021, 0, 1).getTime(); // January 1, 2021 in local time
    const result = displayDateTime(timestamp);
    expect(result).toBe("January 1, 2021");
  });

  // Test that it handles leap years correctly
  test("handles leap years", () => {
    const leapYearDate = new Date(2020, 1, 29); // February 29, 2020 (leap year)
    const result = displayDateTime(leapYearDate);
    expect(result).toBe("February 29, 2020");
  });

  // Test for edge case: Current date
  test("handles current date", () => {
    const currentDate = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const expected = currentDate.toLocaleDateString("en-US", options);

    const result = displayDateTime(currentDate);
    expect(result).toBe(expected);
  });

  // Test for invalid input
  test("handles invalid date input", () => {
    const result = displayDateTime("invalid-date");
    expect(result).toBe("Invalid date");
  });

  // Test with custom formatting options
  test("accepts custom formatting options", () => {
    const testDate = new Date(2022, 3, 15);
    const customOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    const result = displayDateTime(testDate, customOptions);
    // Format will be like "Friday, Apr 15, 2022"
    // Check parts to avoid issues with locale differences in testing environments
    expect(result).toContain("2022");
    expect(result).toContain("Apr");
    expect(result).toContain("15");
  });

  // Test with different locale
  test("accepts different locale", () => {
    const testDate = new Date(2022, 3, 15);
    const result = displayDateTime(testDate, null, "es-ES");
    // Format will depend on the locale, but we can check parts
    expect(result).toContain("2022");
    expect(result).toContain("abril"); // "April" in Spanish is "abril"
    expect(result).toContain("15");
  });

  // Test error handling
  test("handles errors gracefully", () => {
    // Mock console.error to prevent actual error logs during test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Create a case that would throw an error
    const malformedDate = {
      toString: () => {
        throw new Error("Test error");
      },
    };

    const result = displayDateTime(malformedDate);
    expect(result).toBe("Error formatting date");
    expect(console.error).toHaveBeenCalled();

    // Restore original console.error
    console.error = originalConsoleError;
  });
});
