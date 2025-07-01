/**
 * Test suite for the UccFedLienFileNumberSearch component
 *
 * This test file covers:
 * - Initial rendering of the component
 * - Handling successful API responses with valid results
 * - Handling successful API responses with empty results
 * - Handling API responses with invalid data
 * - Handling API exceptions
 * - Testing the alert functionality
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UccFedLienFileNumberSearch from "./UccFedLienFileNumberSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisUccFedLienNum: jest.fn(),
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

// Mock the UccFedLienFileNumberSearchForm component
jest.mock("./UccFedLienFileNumberSearchForm", () => {
  return function MockUccFedLienFileNumberSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="ucc-fed-lien-search-form">
        <button
          onClick={() => searchFor({ fileNum: "12345" }, { borough: "1" })}
          data-testid="mock-search-with-results-button"
        >
          Search with Results
        </button>
        <button
          onClick={() => searchFor({ fileNum: "99999" }, { borough: "1" })}
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

// Mock the UccFedLienFileNumberSearchDisplay component
jest.mock("./UccFedLienFileNumberSearchDisplay", () => {
  return function MockUccFedLienFileNumberSearchDisplay({ results }) {
    return (
      <div data-testid="ucc-fed-lien-search-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("UccFedLienFileNumberSearch Component", () => {
  // Sample valid results
  const validResponse = [
    {
      document_id: "FT-1234567",
      masterRecords: [{ doc_type: "UCC1", recorded_borough: "1" }],
      partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
    },
  ];

  // Sample empty results
  const emptyResponse = [];

  // Sample invalid data response
  const invalidDataResponse = [
    {
      document_id: "FT-1234567",
      masterRecords: [],
      partiesRecords: [],
      legalsRecords: [],
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test initial rendering
  test("renders the component with title and form", () => {
    render(<UccFedLienFileNumberSearch />);

    // Check title and subtitle
    expect(
      screen.getByText("Search By UCC or Federal Lien File Number")
    ).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check instructions are present
    expect(
      screen.getByText(/Searching by File Number is only available/)
    ).toBeInTheDocument();

    // Check form renders
    expect(screen.getByTestId("ucc-fed-lien-search-form")).toBeInTheDocument();

    // Results should not be visible initially
    expect(
      screen.queryByTestId("ucc-fed-lien-search-display")
    ).not.toBeInTheDocument();
  });

  // Test successful search with valid data
  test("displays results when search returns valid data", async () => {
    // Mock API to return valid results
    SnacrisApi.queryAcrisUccFedLienNum.mockResolvedValue(validResponse);

    render(<UccFedLienFileNumberSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisUccFedLienNum).toHaveBeenCalledWith(
        { fileNum: "12345" },
        { borough: "1" }
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
      screen.getByTestId("ucc-fed-lien-search-display")
    ).toBeInTheDocument();
    expect(screen.getByTestId("results-data")).toBeInTheDocument();
  });

  // Test search with empty results
  test("displays error message when search returns no results", async () => {
    // Mock API to return empty results
    SnacrisApi.queryAcrisUccFedLienNum.mockResolvedValue(emptyResponse);

    render(<UccFedLienFileNumberSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-no-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisUccFedLienNum).toHaveBeenCalledWith(
        { fileNum: "99999" },
        { borough: "1" }
      );
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
      screen.queryByTestId("ucc-fed-lien-search-display")
    ).not.toBeInTheDocument();
  });

  // Test search with invalid data
  test("displays error message when search returns invalid data", async () => {
    // Mock API to return invalid data
    SnacrisApi.queryAcrisUccFedLienNum.mockResolvedValue(invalidDataResponse);

    render(<UccFedLienFileNumberSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisUccFedLienNum).toHaveBeenCalled();
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
      screen.queryByTestId("ucc-fed-lien-search-display")
    ).not.toBeInTheDocument();
  });

  // Test API error handling
  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    SnacrisApi.queryAcrisUccFedLienNum.mockRejectedValue(
      new Error("API error")
    );

    render(<UccFedLienFileNumberSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for error alert to appear
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "An error occurred while fetching data. Please try again."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("ucc-fed-lien-search-display")
    ).not.toBeInTheDocument();
  });

  // Test alert setting via form
  test("allows form to set alert messages", async () => {
    render(<UccFedLienFileNumberSearch />);

    // Trigger alert from form
    userEvent.click(screen.getByTestId("mock-set-alert-button"));

    // Wait for the alert to appear
    await waitFor(() => {
      expect(screen.getByTestId("alert-warning")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Test alert"
      );
    });
  });
});
