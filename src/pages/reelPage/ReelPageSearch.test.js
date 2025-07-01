import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReelPageSearch from "./ReelPageSearch";
import SnacrisApi from "../../api/api";

// Mock dependencies
jest.mock("../../api/api", () => ({
  queryAcrisReelPage: jest.fn(),
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

// Mock the ReelPageSearchForm component
jest.mock("./ReelPageSearchForm", () => {
  return function MockReelPageSearchForm({ searchFor, setAlert }) {
    return (
      <div data-testid="reel-page-search-form">
        <button
          onClick={() =>
            searchFor(
              {
                reel_type: "FT",
                reel_year: "2023",
                reel_number: "123",
                page_number: "45",
                doc_type: "DEED",
                doc_class: "DEED",
              },
              {}
            )
          }
          data-testid="mock-search-button"
        >
          Search
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

// Mock the ReelPageSearchDisplay component
jest.mock("./ReelPageSearchDisplay", () => {
  return function MockReelPageSearchDisplay({ results }) {
    return (
      <div data-testid="reel-page-search-display">
        {results && results.length > 0 && (
          <div data-testid="results-data">{JSON.stringify(results)}</div>
        )}
      </div>
    );
  };
});

describe("ReelPageSearch Component", () => {
  const validResponse = {
    dataFound: true,
    results: [
      {
        document_id: "FT-2023-123-45",
        masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
        partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
        legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
      },
    ],
    message: "Results found.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component correctly", () => {
    render(<ReelPageSearch />);
    expect(screen.getByText("Search By Reel & Page")).toBeInTheDocument();
    expect(screen.getByText("Recorded Documents Only")).toBeInTheDocument();
    expect(screen.getByTestId("reel-page-search-form")).toBeInTheDocument();
  });

  test("handles successful search", async () => {
    SnacrisApi.queryAcrisReelPage.mockResolvedValue(validResponse);

    render(<ReelPageSearch />);
    userEvent.click(screen.getByTestId("mock-search-button"));

    await waitFor(() => {
      expect(screen.getByTestId("alert-success")).toBeInTheDocument();
      expect(screen.getByTestId("results-data")).toBeInTheDocument();
    });
  });

  test("handles search error", async () => {
    SnacrisApi.queryAcrisReelPage.mockRejectedValue(new Error("API Error"));

    render(<ReelPageSearch />);
    userEvent.click(screen.getByTestId("mock-search-button"));

    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "An error occurred while fetching data."
      );
    });
  });

  test("handles alert setting", async () => {
    render(<ReelPageSearch />);
    userEvent.click(screen.getByTestId("mock-set-alert-button"));

    await waitFor(() => {
      expect(screen.getByTestId("alert-warning")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Test alert"
      );
    });
  });
});
