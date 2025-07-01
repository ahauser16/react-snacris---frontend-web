/**
 * Test suite for AddressParcelLookupDisplay component
 *
 * This component is responsible for:
 * - Showing a message when no search has been submitted
 * - Displaying error messages when results contain an error
 * - Showing a message when no analysis data is found
 * - Rendering the AddressParcelCard component with analysis data
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import AddressParcelLookupDisplay from "./AddressParcelLookupDisplay";
import { renderWithRouter } from "../../test-utils/test-helpers";

// Mock the AddressParcelCard component
jest.mock("./AddressParcelCard", () => {
  return function MockAddressParcelCard(props) {
    return (
      <div data-testid="address-parcel-card">
        <div data-testid="mock-borough">{props.borough}</div>
        <div data-testid="mock-block">{props.block}</div>
        <div data-testid="mock-lot">{props.lot}</div>
      </div>
    );
  };
});

describe("AddressParcelLookupDisplay Component", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Sample result data with analysis
  const sampleResults = {
    status: "success",
    message: "Results found.",
    analysis: {
      borough: "1",
      block: "123",
      lot: "45",
      street_number: "123",
      street_name: "Main St",
    },
  };

  // Sample result with error
  const errorResults = {
    status: "error",
    error: "An error occurred during processing.",
  };

  // Sample result without analysis
  const noAnalysisResults = {
    status: "success",
    message: "No analysis available.",
  };

  test("renders initial state message when no results are provided", () => {
    renderWithRouter(<AddressParcelLookupDisplay results={null} />);

    // Should display the initial instructions message
    expect(
      screen.getByText("Please submit a search to see results.")
    ).toBeInTheDocument();
    // No results card should be shown
    expect(screen.queryByTestId("address-parcel-card")).not.toBeInTheDocument();
  });

  test("renders error message when results contain error", () => {
    renderWithRouter(<AddressParcelLookupDisplay results={errorResults} />);

    // Should display the error message from the results
    expect(
      screen.getByText("An error occurred during processing.")
    ).toBeInTheDocument();
    // No results card should be shown
    expect(screen.queryByTestId("address-parcel-card")).not.toBeInTheDocument();
  });

  test("renders no analysis message when results don't contain analysis", () => {
    renderWithRouter(
      <AddressParcelLookupDisplay results={noAnalysisResults} />
    );

    // Should display the no analysis data message
    expect(screen.getByText("No analysis data found.")).toBeInTheDocument();
    // No results card should be shown
    expect(screen.queryByTestId("address-parcel-card")).not.toBeInTheDocument();
  });

  test("renders AddressParcelCard when results contain analysis data", () => {
    renderWithRouter(<AddressParcelLookupDisplay results={sampleResults} />);

    // AddressParcelCard should be rendered with the analysis data
    expect(screen.getByTestId("address-parcel-card")).toBeInTheDocument();
    // Check that the data is passed correctly to the card
    expect(screen.getByTestId("mock-borough")).toHaveTextContent("1");
    expect(screen.getByTestId("mock-block")).toHaveTextContent("123");
    expect(screen.getByTestId("mock-lot")).toHaveTextContent("45");

    // Verify no error messages are shown
    expect(
      screen.queryByText("Please submit a search to see results.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("No analysis data found.")
    ).not.toBeInTheDocument();
  });

  test("handles empty results object gracefully", () => {
    renderWithRouter(<AddressParcelLookupDisplay results={{}} />);

    // Since empty object has no analysis property, should show no analysis message
    expect(screen.getByText("No analysis data found.")).toBeInTheDocument();
    // No results card should be shown
    expect(screen.queryByTestId("address-parcel-card")).not.toBeInTheDocument();
  });

  test("handles results with null analysis property", () => {
    const nullAnalysisResults = {
      status: "success",
      message: "Results found but analysis is null.",
      analysis: null,
    };

    renderWithRouter(
      <AddressParcelLookupDisplay results={nullAnalysisResults} />
    );

    // Should display the no analysis data message
    expect(screen.getByText("No analysis data found.")).toBeInTheDocument();
    // No results card should be shown
    expect(screen.queryByTestId("address-parcel-card")).not.toBeInTheDocument();
  });
});
