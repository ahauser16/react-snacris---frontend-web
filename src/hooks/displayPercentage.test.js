import displayPercentage from "./displayPercentage";

describe("displayPercentage", () => {
  // Test basic functionality
  test("formats whole number percentages correctly", () => {
    expect(displayPercentage(50)).toBe("50%");
    expect(displayPercentage(0)).toBe("0%");
    expect(displayPercentage(100)).toBe("100%");
  });

  // Test with decimal percentages
  test("rounds decimal percentages to whole numbers by default", () => {
    expect(displayPercentage(50.4)).toBe("50%"); // Should round down
    expect(displayPercentage(50.5)).toBe("51%"); // Should round up
    expect(displayPercentage(0.1)).toBe("0%"); // Should round down
    expect(displayPercentage(99.9)).toBe("100%"); // Should round up
  });

  // Test with string inputs that are valid numbers
  test("handles numeric strings", () => {
    expect(displayPercentage("50")).toBe("50%");
    expect(displayPercentage("50.5")).toBe("51%");
  });

  // Test with negative percentages
  test("formats negative percentages correctly", () => {
    expect(displayPercentage(-50)).toBe("-50%");
    expect(displayPercentage(-50.5)).toBe("-51%");
  });

  // Test edge cases
  test("handles zero correctly", () => {
    expect(displayPercentage(0)).toBe("0%");
    expect(displayPercentage("0")).toBe("0%");
  });

  // Test invalid inputs
  test("handles invalid inputs", () => {
    expect(displayPercentage(null)).toBe("N/A");
    expect(displayPercentage(undefined)).toBe("N/A");
    expect(displayPercentage("abc")).toBe("N/A"); // Now returns fallback value
  });

  // Test with very large numbers
  test("handles very large numbers", () => {
    expect(displayPercentage(1000000)).toBe("1000000%");
  });

  // Test with very small decimal values
  test("handles very small decimal values", () => {
    expect(displayPercentage(0.01)).toBe("0%");
    expect(displayPercentage(0.001)).toBe("0%");
  });

  // NEW TESTS FOR ENHANCED FEATURES

  // Test precision option
  test("respects precision option", () => {
    expect(displayPercentage(50.4, { precision: 1 })).toBe("50.4%");
    expect(displayPercentage(50.56, { precision: 2 })).toBe("50.56%");
    expect(displayPercentage(0.125, { precision: 3 })).toBe("0.125%");
  });

  // Test showing plus sign for positive numbers
  test("respects showPlusSign option", () => {
    expect(displayPercentage(50, { showPlusSign: true })).toBe("+50%");
    expect(displayPercentage(-50, { showPlusSign: true })).toBe("-50%"); // Negative still shows minus
    expect(displayPercentage(0, { showPlusSign: true })).toBe("0%"); // Zero doesn't get a plus sign
  });

  // Test using parentheses for negative values
  test("respects useParentheses option", () => {
    expect(displayPercentage(-50, { useParentheses: true })).toBe("(50)%");
    expect(
      displayPercentage(-50.5, { useParentheses: true, precision: 1 })
    ).toBe("(50.5)%");
    expect(displayPercentage(50, { useParentheses: true })).toBe("50%"); // Positive unchanged
  });

  // Test with custom fallback value
  test("respects fallbackValue option", () => {
    expect(displayPercentage(null, { fallbackValue: "Unknown" })).toBe(
      "Unknown"
    );
    expect(displayPercentage("invalid", { fallbackValue: "0%" })).toBe("0%");
  });

  // Test trimming trailing zeros
  test("respects trimZeros option", () => {
    expect(displayPercentage(50, { precision: 2, trimZeros: true })).toBe(
      "50%"
    );
    expect(displayPercentage(50.5, { precision: 2, trimZeros: true })).toBe(
      "50.5%"
    );
    expect(displayPercentage(50.5, { precision: 2, trimZeros: true })).toBe(
      "50.5%"
    );
    expect(displayPercentage(50.0, { precision: 2, trimZeros: true })).toBe(
      "50%"
    );

    // With trimZeros: false
    expect(displayPercentage(50, { precision: 2, trimZeros: false })).toBe(
      "50.00%"
    );
    expect(displayPercentage(50.5, { precision: 2, trimZeros: false })).toBe(
      "50.50%"
    );
  });

  // Test combinations of options
  test("handles combinations of options", () => {
    // Precision + showPlusSign
    expect(
      displayPercentage(50.5, {
        precision: 1,
        showPlusSign: true,
      })
    ).toBe("+50.5%");

    // Precision + useParentheses for negative
    expect(
      displayPercentage(-50.5, {
        precision: 1,
        useParentheses: true,
      })
    ).toBe("(50.5)%");

    // Complex combination
    expect(
      displayPercentage(99.99, {
        precision: 2,
        showPlusSign: true,
        trimZeros: false,
      })
    ).toBe("+99.99%");

    // Negative value with all options
    expect(
      displayPercentage(-99.9, {
        precision: 2,
        useParentheses: true,
        trimZeros: false,
      })
    ).toBe("(99.90)%");
  });
});
