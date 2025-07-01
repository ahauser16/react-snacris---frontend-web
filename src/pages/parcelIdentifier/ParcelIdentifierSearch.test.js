/**
 * Test suite for the ParcelIdentifierSearch component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Handling successful API responses with valid results
 * - Handling successful API responses with empty results
 * - Handling failed API responses
 * - Handling API exceptions
 * - Testing the alert functionality
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParcelIdentifierSearch from "./ParcelIdentifierSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisParcel: jest.fn(),
}));

// Mock the Alert component
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

// Mock the ParcelIdentifierSearchForm component
jest.mock("./ParcelIdentifierSearchForm", () => {
  return function MockParcelIdentifierSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="parcel-identifier-search-form">
        <button
          onClick={() =>
            searchFor(
              {
                doc_type: "DEED",
                doc_class: "DEED",
                recorded_date_range: "to-current-date-default",
                recorded_date_start: "",
                recorded_date_end: "",
              },
              {
                borough: "1",
                block: "123",
                lot: "45",
                unit: "",
              }
            )
          }
          data-testid="mock-search-with-results-button"
        >
          Search with Results
        </button>
        <button
          onClick={() =>
            searchFor(
              {
                doc_type: "UNKNOWN",
                doc_class: "UNKNOWN",
                recorded_date_range: "to-current-date-default",
                recorded_date_start: "",
                recorded_date_end: "",
              },
              {
                borough: "1",
                block: "999",
                lot: "999",
                unit: "",
              }
            )
          }
          data-testid="mock-search-no-results-button"
        >
          Search with No Results
        </button>
        <button
          onClick={() =>
            searchFor(
              {
                doc_type: "UNKNOWN",
                doc_class: "UNKNOWN",
                recorded_date_range: "to-current-date-default",
                recorded_date_start: "",
                recorded_date_end: "",
              },
              {
                borough: "1",
                block: "888",
                lot: "888",
                unit: "",
              }
            )
          }
          data-testid="mock-search-legals-api-error-button"
        >
          Search with Legals API Error
        </button>
        <button
          onClick={() =>
            searchFor(
              {
                doc_type: "UNKNOWN",
                doc_class: "UNKNOWN",
                recorded_date_range: "to-current-date-default",
                recorded_date_start: "",
                recorded_date_end: "",
              },
              {
                borough: "1",
                block: "777",
                lot: "777",
                unit: "",
              }
            )
          }
          data-testid="mock-search-master-api-error-button"
        >
          Search with Master API Error
        </button>
        <button
          onClick={() =>
            setAlert({ type: "warning", messages: ["Test alert"] })
          }
          data-testid="mock-set-alert-button"
        >
          Set Alert
        </button>
      </div>
    );
  };
});

// Mock the ParcelIdentifierSearchDisplay component
jest.mock("./ParcelIdentifierSearchDisplay", () => {
  return function MockParcelIdentifierSearchDisplay({ results }) {
    return (
      <div data-testid="parcel-identifier-search-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("ParcelIdentifierSearch Component", () => {
  // Sample valid results
  const validResponse = {
    dataFound: true,
    results: [
      {
        document_id: "FT-1234567",
        masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
        partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
        legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
      },
    ],
    message: "Results found.",
  };

  // Sample empty results
  const emptyResponse = {
    dataFound: false,
    results: [],
    message: "No results found.",
  };

  // Sample legals API error
  const legalsApiErrorResponse = {
    dataFound: false,
    errMsg: [
      "Failed to fetch document IDs from Real Property Legals API",
      "No document IDs found",
    ],
  };

  // Sample master API error
  const masterApiErrorResponse = {
    dataFound: false,
    errMsg: [
      "Failed to fetch document IDs from Real Property Master API",
      "No document IDs found",
    ],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test for initial component rendering
  test("renders the component with title and form", () => {
    render(<ParcelIdentifierSearch />);

    // Check title and subtitle
    expect(
      screen.getByText("Search By Parcel (Borough, Block & Lot)")
    ).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check instructions
    expect(
      screen.getByText(/Enter the Borough, Block & Lot/)
    ).toBeInTheDocument();

    // Check form renders
    expect(
      screen.getByTestId("parcel-identifier-search-form")
    ).toBeInTheDocument();

    // Results should not be visible initially
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for successful search with valid data
  test("displays results when search returns valid data", async () => {
    // Mock API to return valid results
    SnacrisApi.queryAcrisParcel.mockResolvedValue(validResponse);

    render(<ParcelIdentifierSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisParcel).toHaveBeenCalledWith(
        {
          doc_type: "DEED",
          doc_class: "DEED",
          recorded_date_range: "to-current-date-default",
          recorded_date_start: "",
          recorded_date_end: "",
        },
        {
          borough: "1",
          block: "123",
          lot: "45",
          unit: "",
        }
      );
    });

    // Check success alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-success")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Results found."
      );
    });

    // Check results display
    expect(
      screen.getByTestId("parcel-identifier-search-display")
    ).toBeInTheDocument();
    expect(screen.getByTestId("results-data")).toBeInTheDocument();
  });

  // Test for search with empty results
  test("displays error message when search returns no results", async () => {
    // Mock API to return empty results
    SnacrisApi.queryAcrisParcel.mockResolvedValue(emptyResponse);

    render(<ParcelIdentifierSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-no-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisParcel).toHaveBeenCalledWith(
        {
          doc_type: "UNKNOWN",
          doc_class: "UNKNOWN",
          recorded_date_range: "to-current-date-default",
          recorded_date_start: "",
          recorded_date_end: "",
        },
        {
          borough: "1",
          block: "999",
          lot: "999",
          unit: "",
        }
      );
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "No results found."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for legals API error handling
  test("displays friendly error message when Real Property Legals API fails", async () => {
    // Mock API to return legals API error
    SnacrisApi.queryAcrisParcel.mockResolvedValue(legalsApiErrorResponse);

    render(<ParcelIdentifierSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-legals-api-error-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisParcel).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      );
    });

    // Check error alert with friendly message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "The combination of your Borough, Tax Block and Tax Lot query did not match any values in the ACRIS dataset."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for master API error handling
  test("displays friendly error message when Real Property Master API fails", async () => {
    // Mock API to return master API error
    SnacrisApi.queryAcrisParcel.mockResolvedValue(masterApiErrorResponse);

    render(<ParcelIdentifierSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-master-api-error-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisParcel).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      );
    });

    // Check error alert with friendly message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "The combination of your Document Class and Document Type query did not match any values in the ACRIS dataset."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for API error handling
  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    SnacrisApi.queryAcrisParcel.mockRejectedValue(new Error("API error"));

    render(<ParcelIdentifierSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to reject and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisParcel).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      );
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "An error occurred while fetching data."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for manually setting alert via form
  test("allows form to set alert messages", async () => {
    render(<ParcelIdentifierSearch />);

    // Trigger alert from form
    userEvent.click(screen.getByTestId("mock-set-alert-button"));

    // Wait for the component to update
    await waitFor(() => {
      // The Alert component is rendered with the provided type and message
      expect(screen.getByTestId("alert-warning")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Test alert"
      );
    });
  });

  // Test for dataFound null condition
  test("does not display results when dataFound is null", async () => {
    render(<ParcelIdentifierSearch />);

    // Results display should not be shown when dataFound is null
    expect(
      screen.queryByTestId("parcel-identifier-search-display")
    ).not.toBeInTheDocument();
  });
});
