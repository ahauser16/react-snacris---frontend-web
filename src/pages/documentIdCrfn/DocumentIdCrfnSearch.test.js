/**
 * Test suite for the DocumentIdCrfnSearch component
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
import DocumentIdCrfnSearch from "./DocumentIdCrfnSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisDocIdCrfn: jest.fn(),
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

// Mock the DocumentIdCrfnSearchForm component
jest.mock("./DocumentIdCrfnSearchForm", () => {
  return function MockDocumentIdCrfnSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="document-id-crfn-search-form">
        <button
          onClick={() => searchFor({ document_id: "FT-1234567" })}
          data-testid="mock-search-doc-id-button"
        >
          Search by Document ID
        </button>
        <button
          onClick={() => searchFor({ crfn: "2023000123456" })}
          data-testid="mock-search-crfn-button"
        >
          Search by CRFN
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

// Mock the DocumentIdCrfnSearchDisplay component
jest.mock("./DocumentIdCrfnSearchDisplay", () => {
  return function MockDocumentIdCrfnSearchDisplay({ results }) {
    return (
      <div data-testid="document-id-crfn-search-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("DocumentIdCrfnSearch Component", () => {
  // Sample valid results with masterRecords
  const validResults = {
    results: [
      {
        document_id: "FT-1234567",
        masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
        partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
        legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
      },
    ],
  };

  // Sample valid results with no records
  const emptyResults = {
    results: [],
  };

  // Sample valid results with empty records array
  const emptyRecordsResults = {
    results: [
      {
        document_id: "FT-1234567",
        masterRecords: [],
        partiesRecords: [],
        legalsRecords: [],
      },
    ],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test for initial component rendering
  test("renders the component with title and form", () => {
    render(<DocumentIdCrfnSearch />);

    // Check title and subtitle
    expect(
      screen.getByText("Search By Document ID or CRFN")
    ).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check instructions
    expect(screen.getByText(/Enter either the/)).toBeInTheDocument();

    // Check form renders
    expect(
      screen.getByTestId("document-id-crfn-search-form")
    ).toBeInTheDocument();

    // Results should not be visible initially
    expect(
      screen.queryByTestId("document-id-crfn-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for successful search with valid data
  test("displays results when search returns valid data", async () => {
    // Mock API to return valid results
    SnacrisApi.queryAcrisDocIdCrfn.mockResolvedValue(validResults);

    render(<DocumentIdCrfnSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-doc-id-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocIdCrfn).toHaveBeenCalledWith({
        document_id: "FT-1234567",
      });
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
      screen.getByTestId("document-id-crfn-search-display")
    ).toBeInTheDocument();
    expect(screen.getByTestId("results-data")).toBeInTheDocument();
  });

  // Test for search with empty results
  test("displays error message when search returns empty results", async () => {
    // Mock API to return empty results
    SnacrisApi.queryAcrisDocIdCrfn.mockResolvedValue(emptyResults);

    render(<DocumentIdCrfnSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-crfn-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocIdCrfn).toHaveBeenCalledWith({
        crfn: "2023000123456",
      });
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "No records found."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("document-id-crfn-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for search with empty records arrays
  test("displays error message when search returns empty record arrays", async () => {
    // Mock API to return empty record arrays
    SnacrisApi.queryAcrisDocIdCrfn.mockResolvedValue(emptyRecordsResults);

    render(<DocumentIdCrfnSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-doc-id-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocIdCrfn).toHaveBeenCalledWith({
        document_id: "FT-1234567",
      });
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "No valid records found in response."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("document-id-crfn-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for API error handling
  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    SnacrisApi.queryAcrisDocIdCrfn.mockRejectedValue(new Error("API error"));

    render(<DocumentIdCrfnSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-doc-id-button"));

    // Wait for the API call to reject and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocIdCrfn).toHaveBeenCalledWith({
        document_id: "FT-1234567",
      });
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
      screen.queryByTestId("document-id-crfn-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for manually setting alert via form
  test("allows form to set alert messages", async () => {
    render(<DocumentIdCrfnSearch />);

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
});
