/**
 * Test suite for the ReelPageSearchDisplay component
 *
 * This test file covers:
 * - Rendering with no results
 * - Rendering with single result
 * - Rendering with multiple results
 * - Document selection functionality
 * - Edge cases and error states
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReelPageSearchDisplay from "./ReelPageSearchDisplay";

// Mock child components
jest.mock(
  "../../components/acris/realPropertyDisplay/RealPropertyCardContainer",
  () => {
    return function MockRealPropertyCardContainer({ group }) {
      return (
        <div data-testid="mock-property-card">
          {group && (
            <div data-testid="property-data">{JSON.stringify(group)}</div>
          )}
        </div>
      );
    };
  }
);

jest.mock("../../components/acris/realPropertyDisplay/DocumentIdMenu", () => {
  return function MockDocumentIdMenu({
    results,
    selectedDocId,
    setSelectedDocId,
  }) {
    return (
      <div data-testid="mock-document-menu">
        <select
          data-testid="doc-id-select"
          value={selectedDocId || ""}
          onChange={(e) => setSelectedDocId(e.target.value)}
        >
          {results.map((result) => (
            <option key={result.document_id} value={result.document_id}>
              {result.document_id}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

describe("ReelPageSearchDisplay Component", () => {
  // Sample test data
  const singleResult = [
    {
      document_id: "FT-2023-123-45",
      masterRecords: [
        {
          doc_type: "DEED",
          recorded_borough: "1",
          reel_type: "FT",
          reel_year: "2023",
          reel_number: "123",
          page_number: "45",
        },
      ],
      partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
    },
  ];

  const multipleResults = [
    ...singleResult,
    {
      document_id: "FT-2023-123-46",
      masterRecords: [
        {
          doc_type: "DEED",
          recorded_borough: "1",
          reel_type: "FT",
          reel_year: "2023",
          reel_number: "123",
          page_number: "46",
        },
      ],
      partiesRecords: [{ party_type: "1", name: "TEST NAME 2" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "46" }],
    },
  ];

  test("displays no results message when results array is empty", () => {
    render(<ReelPageSearchDisplay results={[]} />);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-document-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-property-card")).not.toBeInTheDocument();
  });

  test("displays no results message when results is null", () => {
    render(<ReelPageSearchDisplay results={null} />);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-document-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-property-card")).not.toBeInTheDocument();
  });

  test("renders single result correctly", () => {
    render(<ReelPageSearchDisplay results={singleResult} />);

    // Check if document menu is rendered
    expect(screen.getByTestId("mock-document-menu")).toBeInTheDocument();

    // Check if property card is rendered with correct data
    expect(screen.getByTestId("mock-property-card")).toBeInTheDocument();
    expect(screen.getByTestId("property-data")).toHaveTextContent(
      "FT-2023-123-45"
    );
    expect(screen.getByTestId("property-data")).toHaveTextContent("TEST NAME");
  });

  test("renders multiple results correctly and allows switching between them", async () => {
    render(<ReelPageSearchDisplay results={multipleResults} />);

    // Check initial render
    expect(screen.getByTestId("mock-document-menu")).toBeInTheDocument();
    expect(screen.getByTestId("mock-property-card")).toBeInTheDocument();
    expect(screen.getByTestId("property-data")).toHaveTextContent(
      "FT-2023-123-45"
    );

    // Switch to second document
    const select = screen.getByTestId("doc-id-select");
    userEvent.selectOptions(select, "FT-2023-123-46");

    // Check if display updates
    await waitFor(() => {
      expect(screen.getByTestId("property-data")).toHaveTextContent(
        "FT-2023-123-46"
      );
      expect(screen.getByTestId("property-data")).toHaveTextContent(
        "TEST NAME 2"
      );
    });
  });

  test("selects first document by default", () => {
    render(<ReelPageSearchDisplay results={multipleResults} />);

    // Check if first document is selected by default
    expect(screen.getByTestId("doc-id-select")).toHaveValue("FT-2023-123-45");
    expect(screen.getByTestId("property-data")).toHaveTextContent(
      "FT-2023-123-45"
    );
  });

  test("handles document selection change", async () => {
    render(<ReelPageSearchDisplay results={multipleResults} />);

    // Select second document
    const select = screen.getByTestId("doc-id-select");
    userEvent.selectOptions(select, "FT-2023-123-46");

    // Verify the change
    await waitFor(() => {
      expect(select).toHaveValue("FT-2023-123-46");
      expect(screen.getByTestId("property-data")).toHaveTextContent(
        "FT-2023-123-46"
      );
    });

    // Select first document again
    userEvent.selectOptions(select, "FT-2023-123-45");

    // Verify the change back
    await waitFor(() => {
      expect(select).toHaveValue("FT-2023-123-45");
      expect(screen.getByTestId("property-data")).toHaveTextContent(
        "FT-2023-123-45"
      );
    });
  });
});
