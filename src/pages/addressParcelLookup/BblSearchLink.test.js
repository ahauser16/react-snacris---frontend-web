/**
 * Test suite for BblSearchLink component
 *
 * This component creates a link to the parcel identifier search page with BBL parameters.
 * It accepts borough, block, and lot props and generates the appropriate URL.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { renderWithRouter } from "../../test-utils/test-helpers";
import BblSearchLink from "./BblSearchLink";

describe("BblSearchLink Component", () => {
  // Test data
  const bblData = {
    borough: "1",
    block: "123",
    lot: "45",
  };

  test("renders the link with correct text", () => {
    renderWithRouter(
      <BblSearchLink
        borough={bblData.borough}
        block={bblData.block}
        lot={bblData.lot}
      />
    );

    // Check if the link text is displayed correctly
    expect(
      screen.getByText(
        `Search By BBL: ${bblData.borough}, ${bblData.block}, ${bblData.lot}`
      )
    ).toBeInTheDocument();
  });

  test("generates the correct URL with BBL parameters", () => {
    renderWithRouter(
      <BblSearchLink
        borough={bblData.borough}
        block={bblData.block}
        lot={bblData.lot}
      />
    );

    // Get the link element and check its href attribute
    const linkElement = screen.getByRole("link", {
      name: `Search By BBL: ${bblData.borough}, ${bblData.block}, ${bblData.lot}`,
    });

    // Verify the URL contains the correct query parameters
    expect(linkElement.getAttribute("href")).toBe(
      `/parcelIdentifierSearch?borough=${bblData.borough}&block=${bblData.block}&lot=${bblData.lot}`
    );
  });

  test("applies the correct CSS classes to the link", () => {
    renderWithRouter(
      <BblSearchLink
        borough={bblData.borough}
        block={bblData.block}
        lot={bblData.lot}
      />
    );

    const linkElement = screen.getByRole("link");

    // Check that the link has the expected CSS classes
    expect(linkElement).toHaveClass("btn");
    expect(linkElement).toHaveClass("btn-outline-primary");
    expect(linkElement).toHaveClass("btn-sm");
    expect(linkElement).toHaveClass("mt-2");
  });

  test("sets the correct aria-label on the link", () => {
    renderWithRouter(
      <BblSearchLink
        borough={bblData.borough}
        block={bblData.block}
        lot={bblData.lot}
      />
    );

    const linkElement = screen.getByRole("link");

    // Check the aria-label attribute for accessibility
    expect(linkElement).toHaveAttribute(
      "aria-label",
      `Search By BBL: ${bblData.borough}, ${bblData.block}, ${bblData.lot}`
    );
  });

  test("handles numeric values for BBL parameters", () => {
    // Test with numeric values instead of strings
    const numericBbl = {
      borough: 1,
      block: 123,
      lot: 45,
    };

    renderWithRouter(
      <BblSearchLink
        borough={numericBbl.borough}
        block={numericBbl.block}
        lot={numericBbl.lot}
      />
    );

    // Check if the URL is generated correctly with numeric values
    const linkElement = screen.getByRole("link");
    expect(linkElement.getAttribute("href")).toBe(
      `/parcelIdentifierSearch?borough=${numericBbl.borough}&block=${numericBbl.block}&lot=${numericBbl.lot}`
    );

    // Check if the text display is correct
    expect(
      screen.getByText(
        `Search By BBL: ${numericBbl.borough}, ${numericBbl.block}, ${numericBbl.lot}`
      )
    ).toBeInTheDocument();
  });
});
