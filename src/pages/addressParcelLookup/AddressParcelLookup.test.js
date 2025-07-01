/**
 * Test suite for the AddressParcelLookup component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Handling successful API responses with analysis data
 * - Handling failed API responses
 * - Handling API exceptions
 * - Handling successful API responses without analysis data
 * - Handling unexpected API response formats
 * - Testing the alert functionality
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressParcelLookup from "./AddressParcelLookup";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisAddressParcel: jest.fn(),
}));

jest.mock("../../common/Alert", () => {
  return function MockAlert({ type, messages }) {
    return (
      <div data-testid={`alert-${type}`} className={`alert-${type}`}>
        {messages.map((message, idx) => (
          <div key={idx} data-testid="alert-message">
            {message}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("./AddressParcelLookupForm", () => {
  return function MockAddressParcelLookupForm({ searchFor, setAlert }) {
    return (
      <div data-testid="address-parcel-lookup-form">
        <button
          onClick={() =>
            searchFor({
              borough: "1",
              street_number: "123",
              street_name: "Main St",
            })
          }
          data-testid="mock-submit-button"
        >
          Submit Search
        </button>
        <button
          onClick={() => setAlert({ type: "info", messages: ["Test alert"] })}
          data-testid="mock-set-alert-button"
        >
          Set Alert
        </button>
      </div>
    );
  };
});

// Mock the AddressParcelLookupDisplay component
jest.mock("./AddressParcelLookupDisplay", () => {
  return function MockAddressParcelLookupDisplay({ results }) {
    if (!results) {
      return (
        <p className="text-muted">Please submit a search to see results.</p>
      );
    }
    if (results.error) {
      return <p className="text-danger">{results.error}</p>;
    }
    return (
      <div data-testid="address-parcel-lookup-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

// We don't need to mock AddressParcelLookup itself since we're testing it
// Instead, let's use the actual component implementation

describe("AddressParcelLookup Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test for initial component rendering
  test("renders the component with title and form", () => {
    render(<AddressParcelLookup />);

    // Check title and subtitle
    expect(screen.getByText("Lookup Address or Parcel")).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check form is rendered
    expect(
      screen.getByTestId("address-parcel-lookup-form")
    ).toBeInTheDocument();

    // No results should be displayed initially
    expect(
      screen.queryByTestId("address-parcel-lookup-display")
    ).not.toBeInTheDocument();
  });

  // Test for successful API response with analysis data
  test("displays results when search is successful", async () => {
    // Mock a successful API response
    const mockSuccessResponse = {
      status: "success",
      message: "Results found successfully.",
      analysis: {
        borough: "1",
        block: "123",
        lot: "45",
        street_number: "123",
        street_name: "Main St",
      },
    };

    SnacrisApi.queryAcrisAddressParcel.mockResolvedValue(mockSuccessResponse);

    render(<AddressParcelLookup />);

    // Trigger the search
    const submitButton = screen.getByTestId("mock-submit-button");
    await userEvent.click(submitButton);

    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByTestId("results-data")).toBeInTheDocument();
    });

    // Check that API was called with correct parameters
    expect(SnacrisApi.queryAcrisAddressParcel).toHaveBeenCalledWith({
      borough: "1",
      street_number: "123",
      street_name: "Main St",
    });

    // Check success alert
    expect(screen.getByTestId("alert-success")).toBeInTheDocument();
    expect(screen.getByText("Results found successfully.")).toBeInTheDocument();
  });

  // Test for failed API response
  test("displays error when search fails", async () => {
    // Mock a failed API response
    const mockFailedResponse = {
      status: "failed",
      message: "Failed to fetch records from Real Property Legals API",
    };

    SnacrisApi.queryAcrisAddressParcel.mockResolvedValue(mockFailedResponse);

    render(<AddressParcelLookup />);

    // Trigger the search
    const submitButton = screen.getByTestId("mock-submit-button");
    await userEvent.click(submitButton);

    // Check that appropriate error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(
        screen.getByText(
          "The combination of your Borough, Street Number and Street Name query did not match any values in the ACRIS dataset."
        )
      ).toBeInTheDocument();
    });

    // Results should not be displayed
    expect(screen.queryByTestId("results-data")).not.toBeInTheDocument();
  });

  // Test for API exception handling
  test("displays error when API call throws an exception", async () => {
    // Mock an API exception
    SnacrisApi.queryAcrisAddressParcel.mockRejectedValue(
      new Error("Network error")
    );

    render(<AddressParcelLookup />);

    // Trigger the search
    const submitButton = screen.getByTestId("mock-submit-button");
    await userEvent.click(submitButton);

    // Check that appropriate error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(
        screen.getByText(
          "An error occurred while fetching data. Please try again."
        )
      ).toBeInTheDocument();
    });

    // Results should not be displayed
    expect(screen.queryByTestId("results-data")).not.toBeInTheDocument();
  });

  // Test for successful API response without analysis data
  test("handles success response with no analysis data", async () => {
    // Mock a successful API response but with no analysis data
    const mockSuccessNoAnalysisResponse = {
      status: "success",
      message: "No analysis data available.",
    };

    SnacrisApi.queryAcrisAddressParcel.mockResolvedValue(
      mockSuccessNoAnalysisResponse
    );

    render(<AddressParcelLookup />);

    // Trigger the search
    const submitButton = screen.getByTestId("mock-submit-button");
    await userEvent.click(submitButton);

    // Check that appropriate alert is displayed
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByText("No analysis data found.")).toBeInTheDocument();
    });
  });

  // Test for unexpected API response format
  test("handles unexpected response format", async () => {
    // Mock an unexpected API response format
    const mockUnexpectedResponse = {
      status: "success",
      // No message and no analysis
    };

    SnacrisApi.queryAcrisAddressParcel.mockResolvedValue(
      mockUnexpectedResponse
    );

    render(<AddressParcelLookup />);

    // Trigger the search
    const submitButton = screen.getByTestId("mock-submit-button");
    await userEvent.click(submitButton);

    // Check that appropriate error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      // The component shows "No analysis data found." for this case
      expect(screen.getByText("No analysis data found.")).toBeInTheDocument();
    });
  });

  // Test for custom alert setting
  test("allows setting custom alerts", async () => {
    render(<AddressParcelLookup />);

    // Trigger a custom alert
    const alertButton = screen.getByTestId("mock-set-alert-button");
    await userEvent.click(alertButton);

    // Check that the custom alert is displayed
    expect(screen.getByTestId("alert-info")).toBeInTheDocument();
    expect(screen.getByText("Test alert")).toBeInTheDocument();
  });
});
