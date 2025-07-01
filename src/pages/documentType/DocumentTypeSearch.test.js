/**
 * Test suite for the DocumentTypeSearch component
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
import DocumentTypeSearch from "./DocumentTypeSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisDocumentType: jest.fn(),
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

// Mock the DocumentTypeSearchForm component
jest.mock("./DocumentTypeSearchForm", () => {
  return function MockDocumentTypeSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="document-type-search-form">
        <button
          onClick={() =>
            searchFor(
              {
                doc_type: "DEED",
                doc_class: "DEED",
              },
              {
                borough: "1",
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
              },
              {
                borough: "1",
              }
            )
          }
          data-testid="mock-search-no-results-button"
        >
          Search with No Results
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

// Mock the DocumentTypeSearchDisplay component
jest.mock("./DocumentTypeSearchDisplay", () => {
  return function MockDocumentTypeSearchDisplay({ results }) {
    return (
      <div data-testid="document-type-search-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("DocumentTypeSearch Component", () => {
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
    message: "Results found successfully.",
  };

  // Sample empty results
  const emptyResponse = {
    dataFound: false,
    results: [],
    message: "No documents found.",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test for initial component rendering
  test("renders the component with title and form", () => {
    render(<DocumentTypeSearch />);

    // Check title and subtitle
    expect(screen.getByText("Search By Document Type")).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check instructions
    expect(screen.getByText(/Select the document class/)).toBeInTheDocument();

    // Check form renders
    expect(screen.getByTestId("document-type-search-form")).toBeInTheDocument();

    // Results should not be visible initially
    expect(
      screen.queryByTestId("document-type-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for successful search with valid data
  test("displays results when search returns valid data", async () => {
    // Mock API to return valid results
    SnacrisApi.queryAcrisDocumentType.mockResolvedValue(validResponse);

    render(<DocumentTypeSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocumentType).toHaveBeenCalledWith(
        { doc_type: "DEED", doc_class: "DEED" },
        { borough: "1" }
      );
    });

    // Check success alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-success")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Results found successfully."
      );
    });

    // Check results display
    expect(
      screen.getByTestId("document-type-search-display")
    ).toBeInTheDocument();
    expect(screen.getByTestId("results-data")).toBeInTheDocument();
  });

  // Test for search with empty results
  test("displays error message when search returns no results", async () => {
    // Mock API to return empty results
    SnacrisApi.queryAcrisDocumentType.mockResolvedValue(emptyResponse);

    render(<DocumentTypeSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-no-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocumentType).toHaveBeenCalledWith(
        { doc_type: "UNKNOWN", doc_class: "UNKNOWN" },
        { borough: "1" }
      );
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "No documents found."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("document-type-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for API error handling
  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    SnacrisApi.queryAcrisDocumentType.mockRejectedValue(new Error("API error"));

    render(<DocumentTypeSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to reject and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisDocumentType).toHaveBeenCalledWith(
        { doc_type: "DEED", doc_class: "DEED" },
        { borough: "1" }
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
      screen.queryByTestId("document-type-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for manually setting alert via form
  test("allows form to set alert messages", async () => {
    render(<DocumentTypeSearch />);

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
    render(<DocumentTypeSearch />);

    // Results display should not be shown when dataFound is null
    expect(
      screen.queryByTestId("document-type-search-display")
    ).not.toBeInTheDocument();
  });
});
