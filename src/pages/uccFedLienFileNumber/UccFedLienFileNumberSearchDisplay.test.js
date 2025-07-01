/**
 * Test suite for the UccFedLienFileNumberSearchDisplay component
 *
 * This test file covers:
 * - Initial rendering with valid results
 * - Handling empty or null results
 * - Document selection functionality
 * - Display of selected document details
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UccFedLienFileNumberSearchDisplay from "./UccFedLienFileNumberSearchDisplay";

// Mock the child components
jest.mock("../../components/acris/realPropertyDisplay/DocumentIdMenu", () => {
  return function MockDocumentIdMenu({
    results,
    selectedDocId,
    setSelectedDocId,
  }) {
    return (
      <div data-testid="document-id-menu">
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

jest.mock(
  "../../components/acris/realPropertyDisplay/RealPropertyCardContainer",
  () => {
    return function MockRealPropertyCardContainer({ group }) {
      return (
        <div data-testid="property-card-container">
          <div data-testid="document-id">{group.document_id}</div>
          <div data-testid="master-data">
            {JSON.stringify(group.masterRecords)}
          </div>
          <div data-testid="parties-data">
            {JSON.stringify(group.partiesRecords)}
          </div>
          <div data-testid="legals-data">
            {JSON.stringify(group.legalsRecords)}
          </div>
        </div>
      );
    };
  }
);

describe("UccFedLienFileNumberSearchDisplay Component", () => {
  // Sample test data
  const sampleResults = [
    {
      document_id: "FT-1234567",
      masterRecords: [{ doc_type: "UCC1", recorded_borough: "1" }],
      partiesRecords: [{ party_type: "1", name: "TEST NAME 1" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
    },
    {
      document_id: "FT-7654321",
      masterRecords: [{ doc_type: "UCC3", recorded_borough: "2" }],
      partiesRecords: [{ party_type: "1", name: "TEST NAME 2" }],
      legalsRecords: [{ borough: "2", block: "456", lot: "78" }],
    },
  ];

  // Test rendering with valid results
  test("renders with initial results and selects first document", () => {
    render(<UccFedLienFileNumberSearchDisplay results={sampleResults} />);

    // Check that menu is rendered
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();

    // Check that property card container is rendered with first document
    const container = screen.getByTestId("property-card-container");
    expect(container).toBeInTheDocument();

    // Verify first document is selected by default
    expect(screen.getByTestId("document-id")).toHaveTextContent("FT-1234567");
  });

  // Test document selection
  test("updates display when different document is selected", async () => {
    render(<UccFedLienFileNumberSearchDisplay results={sampleResults} />);

    // Select the second document
    const select = screen.getByTestId("doc-id-select");
    await userEvent.selectOptions(select, "FT-7654321");

    // Verify the second document's data is displayed
    expect(screen.getByTestId("document-id")).toHaveTextContent("FT-7654321");
    expect(screen.getByTestId("master-data")).toHaveTextContent("UCC3");
    expect(screen.getByTestId("parties-data")).toHaveTextContent("TEST NAME 2");
  });

  // Test with empty results
  test("displays error message when results array is empty", () => {
    render(<UccFedLienFileNumberSearchDisplay results={[]} />);

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("property-card-container")
    ).not.toBeInTheDocument();
  });

  // Test with null results
  test("displays error message when results is null", () => {
    render(<UccFedLienFileNumberSearchDisplay results={null} />);

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("property-card-container")
    ).not.toBeInTheDocument();
  });

  // Test with single result
  test("renders correctly with a single result", () => {
    const singleResult = [sampleResults[0]];
    render(<UccFedLienFileNumberSearchDisplay results={singleResult} />);

    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();
    expect(screen.getByTestId("property-card-container")).toBeInTheDocument();
    expect(screen.getByTestId("document-id")).toHaveTextContent("FT-1234567");
  });
});
