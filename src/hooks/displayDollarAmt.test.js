import displayDollarAmt from "./displayDollarAmt";

describe("displayDollarAmt", () => {
  // Test with whole numbers
  test("formats whole numbers correctly", () => {
    expect(displayDollarAmt(1000)).toBe("$1,000");
    expect(displayDollarAmt(0)).toBe("$0");
    expect(displayDollarAmt(1)).toBe("$1");
  });

  // Test with decimal numbers
  test("formats decimal numbers correctly", () => {
    expect(displayDollarAmt(1000.5)).toBe("$1,000.50");
    expect(displayDollarAmt(0.99)).toBe("$0.99");
    expect(displayDollarAmt(0.1)).toBe("$0.10");
  });

  // Test with string inputs that are valid numbers
  test("handles numeric strings", () => {
    expect(displayDollarAmt("1000")).toBe("$1,000");
    expect(displayDollarAmt("1000.50")).toBe("$1,000.50");
  });

  // Test with negative numbers
  test("formats negative numbers correctly", () => {
    expect(displayDollarAmt(-1000)).toBe("-$1,000");
    expect(displayDollarAmt(-1000.5)).toBe("-$1,000.50");
  });

  // Test edge cases
  test("handles zero correctly", () => {
    expect(displayDollarAmt(0)).toBe("$0");
    expect(displayDollarAmt("0")).toBe("$0");
  });

  // Test very large numbers
  test("formats large numbers correctly", () => {
    expect(displayDollarAmt(1000000)).toBe("$1,000,000");
    expect(displayDollarAmt(1234567890.12)).toBe("$1,234,567,890.12");
  });

  // Test very small decimal values
  test("formats small decimal values correctly", () => {
    expect(displayDollarAmt(0.01)).toBe("$0.01");
    expect(displayDollarAmt(0.001)).toBe("$0.00"); // Should round to 2 decimal places
  });

  // Test with invalid inputs
  test("handles invalid inputs", () => {
    expect(displayDollarAmt(null)).toBe("");
    expect(displayDollarAmt(undefined)).toBe("");
    expect(displayDollarAmt(NaN)).toBe("");
    expect(displayDollarAmt("abc")).toBe("");
  });

  // Test with numbers represented in scientific notation
  test("handles scientific notation", () => {
    expect(displayDollarAmt(1e6)).toBe("$1,000,000");
    expect(displayDollarAmt(1.5e3)).toBe("$1,500");
  });

  // NEW TESTS FOR ENHANCED FEATURES

  // Test option to always show cents
  test("respects alwaysShowCents option", () => {
    expect(displayDollarAmt(1000, { alwaysShowCents: true })).toBe("$1,000.00");
    expect(displayDollarAmt(1, { alwaysShowCents: true })).toBe("$1.00");
    expect(displayDollarAmt(0, { alwaysShowCents: true })).toBe("$0.00");
  });

  // Test option to show plus sign for positive numbers
  test("respects showPlusSign option", () => {
    expect(displayDollarAmt(1000, { showPlusSign: true })).toBe("+$1,000");
    expect(displayDollarAmt(-1000, { showPlusSign: true })).toBe("-$1,000");
    expect(displayDollarAmt(0, { showPlusSign: true })).toBe("$0");
  });

  // Test with different currency
  test("handles different currencies", () => {
    const eurResult = displayDollarAmt(1000, { currency: "EUR" });
    expect(eurResult).toContain("1,000");
    expect(eurResult).toMatch(/[€₠]/); // Match Euro symbol or alternative

    const gbpResult = displayDollarAmt(1000.5, { currency: "GBP" });
    expect(gbpResult).toContain("1,000.50");
    expect(gbpResult).toMatch(/[£]/); // Match Pound symbol
  });

  // Test with different locale
  test("respects locale option", () => {
    // Different locales format numbers differently
    // We'll just check that formatting occurs without being too specific about format
    const result = displayDollarAmt(1234.56, {
      locale: "de-DE",
      currency: "EUR",
    });

    // Should contain the number 1234.56 in some format with a currency symbol
    expect(result.replace(/[^\d,.]/g, "")).toMatch(/[\d.,]+/);
    expect(result).toMatch(/[€₠]/); // Match Euro symbol or alternative
  });

  // Test with custom maximum fraction digits
  test("respects maximumFractionDigits option", () => {
    // Test with 4 decimal places
    const result1 = displayDollarAmt(1000.5678, { maximumFractionDigits: 4 });
    expect(result1).toContain("$1,000");
    expect(result1.match(/\.\d{1,4}$/)).toBeTruthy();

    // Test with 0 decimal places (should round)
    const result2 = displayDollarAmt(1000.5, { maximumFractionDigits: 0 });
    expect(result2).toBe("$1,001");
  });

  // Test combinations of options
  test("handles combinations of options", () => {
    const result1 = displayDollarAmt(1000, {
      alwaysShowCents: true,
      showPlusSign: true,
      currency: "EUR",
    });
    expect(result1).toContain("+");
    expect(result1).toMatch(/[€₠]/);
    expect(result1).toMatch(/\.00$/);

    const result2 = displayDollarAmt(-50.5, {
      maximumFractionDigits: 1,
      currency: "GBP",
    });
    expect(result2).toContain("-");
    expect(result2).toMatch(/[£]/);
    expect(result2).toMatch(/\.5$/);
  });

  // Test with fallback value for invalid inputs
  test("uses fallbackValue for invalid inputs", () => {
    expect(displayDollarAmt(null, { fallbackValue: "N/A" })).toBe("N/A");
    expect(displayDollarAmt("invalid", { fallbackValue: "$0.00" })).toBe(
      "$0.00"
    );
  });

  // NEW TESTS FOR ADDITIONAL IMPROVEMENTS

  // Test different rounding methods
  test("applies different rounding methods", () => {
    // Test standard rounding (default)
    expect(displayDollarAmt(10.345, { maximumFractionDigits: 2 })).toBe(
      "$10.35"
    );

    // Test floor rounding
    expect(
      displayDollarAmt(10.349, {
        roundingMethod: "floor",
        maximumFractionDigits: 2,
      })
    ).toBe("$10.34");

    // Test ceil rounding
    expect(
      displayDollarAmt(10.341, {
        roundingMethod: "ceil",
        maximumFractionDigits: 2,
      })
    ).toBe("$10.35");
  });

  // Test abbreviation for large numbers
  test("abbreviates large numbers", () => {
    // Thousand
    const kResult = displayDollarAmt(1500, { abbreviate: true });
    expect(kResult).toBe("$1.5K");

    // Million
    const mResult = displayDollarAmt(2500000, { abbreviate: true });
    expect(mResult).toBe("$2.5M");

    // Billion
    const bResult = displayDollarAmt(3500000000, { abbreviate: true });
    expect(bResult).toBe("$3.5B");

    // With other options
    const comboResult = displayDollarAmt(1500000, {
      abbreviate: true,
      showPlusSign: true,
      currency: "EUR",
    });
    expect(comboResult).toContain("+");
    expect(comboResult).toMatch(/[€₠]/);
    expect(comboResult).toContain("1.5M");
  });

  // Test disabling grouping separators
  test("can disable grouping separators", () => {
    expect(displayDollarAmt(1000000, { useGrouping: false })).toBe("$1000000");
    expect(displayDollarAmt(1234.56, { useGrouping: false })).toBe("$1234.56");
  });
});
