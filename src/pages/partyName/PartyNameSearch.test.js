/**
 * Test suite for the PartyNameSearch component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Handling successful API responses with valid results
 * - Handling successful API responses with empty results
 * - Handling failed API responses (various error scenarios)
 * - Handling API exceptions
 * - Testing the alert functionality
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartyNameSearch from "./PartyNameSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisPartyName: jest.fn(),
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

// Mock the PartyNameSearchForm component
jest.mock("./PartyNameSearchForm", () => {
  return function MockPartyNameSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="party-name-search-form">
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
                party_name: "Smith",
                party_type: "1",
              },
              {
                borough: "",
                block: "",
                lot: "",
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
                party_name: "NonexistentName",
                party_type: "1",
              },
              {
                borough: "",
                block: "",
                lot: "",
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
                party_name: "InvalidParty",
                party_type: "1",
              },
              {
                borough: "",
                block: "",
                lot: "",
                unit: "",
              }
            )
          }
          data-testid="mock-search-parties-api-error-button"
        >
          Search with Parties API Error
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
                party_name: "MasterError",
                party_type: "1",
              },
              {
                borough: "",
                block: "",
                lot: "",
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

// Mock the PartyNameSearchDisplay component
jest.mock("./PartyNameSearchDisplay", () => {
  return function MockPartyNameSearchDisplay({ results }) {
    return (
      <div data-testid="party-name-search-display">
        {results && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("PartyNameSearch Component", () => {
  // Sample valid results
  const validResponse = {
    dataFound: true,
    results: [
      {
        document_id: "FT-1234567",
        masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
        partiesRecords: [{ party_type: "1", name: "SMITH JOHN" }],
        legalsRecords: [],
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

  // Sample parties API error
  const partiesApiErrorResponse = {
    dataFound: false,
    errMsg: [
      "Failed to fetch document IDs from PartiesRealPropApi.fetchAcrisDocumentIdsCrossRef",
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
    render(<PartyNameSearch />);

    // Check title and subtitle
    expect(screen.getByText("Search By Party Name")).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();

    // Check instructions
    expect(
      screen.getByText(/Enter the name of the party in the field below/)
    ).toBeInTheDocument();

    // Check form renders
    expect(screen.getByTestId("party-name-search-form")).toBeInTheDocument();

    // Results should not be visible initially
    expect(
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for successful search with valid data
  test("displays results when search returns valid data", async () => {
    // Mock API to return valid results
    SnacrisApi.queryAcrisPartyName.mockResolvedValue(validResponse);

    render(<PartyNameSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisPartyName).toHaveBeenCalledWith(
        {
          doc_type: "DEED",
          doc_class: "DEED",
          recorded_date_range: "to-current-date-default",
          recorded_date_start: "",
          recorded_date_end: "",
        },
        {
          party_name: "Smith",
          party_type: "1",
        },
        {
          borough: "",
          block: "",
          lot: "",
          unit: "",
        },
        null,
        null
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
    expect(screen.getByTestId("party-name-search-display")).toBeInTheDocument();
    expect(screen.getByTestId("results-data")).toBeInTheDocument();
  });

  // Test for search with empty results
  test("displays error message when search returns no results", async () => {
    // Mock API to return empty results
    SnacrisApi.queryAcrisPartyName.mockResolvedValue(emptyResponse);

    render(<PartyNameSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-no-results-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisPartyName).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
        null,
        null
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
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for parties API error handling
  test("displays friendly error message when Parties API fails", async () => {
    // Mock API to return parties API error
    SnacrisApi.queryAcrisPartyName.mockResolvedValue(partiesApiErrorResponse);

    render(<PartyNameSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-parties-api-error-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisPartyName).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
        null,
        null
      );
    });

    // Check error alert with friendly message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Your Party Name query did not match any values in the ACRIS dataset."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for master API error handling
  test("displays friendly error message when Real Property Master API fails", async () => {
    // Mock API to return master API error
    SnacrisApi.queryAcrisPartyName.mockResolvedValue(masterApiErrorResponse);

    render(<PartyNameSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-master-api-error-button"));

    // Wait for the API call to resolve and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisPartyName).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
        null,
        null
      );
    });

    // Check error alert with friendly message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Your Recording Date, Document Class and/or Document Type query did not match any values in the ACRIS dataset."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for API error handling
  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    SnacrisApi.queryAcrisPartyName.mockRejectedValue(new Error("API error"));

    render(<PartyNameSearch />);

    // Trigger a search
    userEvent.click(screen.getByTestId("mock-search-with-results-button"));

    // Wait for the API call to reject and component to update
    await waitFor(() => {
      expect(SnacrisApi.queryAcrisPartyName).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
        null,
        null
      );
    });

    // Check error alert
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "An error occurred while fetching data. Please try again."
      );
    });

    // Results display should not be shown
    expect(
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });

  // Test for manually setting alert via form
  test("allows form to set alert messages", async () => {
    render(<PartyNameSearch />);

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
    render(<PartyNameSearch />);

    // Results display should not be shown when dataFound is null
    expect(
      screen.queryByTestId("party-name-search-display")
    ).not.toBeInTheDocument();
  });
});
