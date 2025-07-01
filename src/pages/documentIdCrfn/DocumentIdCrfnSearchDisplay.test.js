/**
 * Test suite for DocumentIdCrfnSearchDisplay component
 *
 * This component is responsible for:
 * - Displaying a "No results found" message when results are empty
 * - Rendering a menu of document IDs when multiple results are available
 * - Allowing selection of different document IDs
 * - Displaying the selected document's details
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentIdCrfnSearchDisplay from "./DocumentIdCrfnSearchDisplay";

// Mock the dependencies
jest.mock("../../components/acris/realPropertyDisplay/DocumentIdMenu", () => {
  return function MockDocumentIdMenu({
    results,
    selectedDocId,
    setSelectedDocId,
  }) {
    return (
      <div data-testid="document-id-menu">
        <div data-testid="menu-results-count">{results.length}</div>
        <div data-testid="menu-selected-doc-id">{selectedDocId}</div>
        {results.map((doc) => (
          <button
            key={doc.document_id}
            data-testid={`select-doc-${doc.document_id}`}
            onClick={() => setSelectedDocId(doc.document_id)}
          >
            {doc.document_id}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock(
  "../../components/acris/realPropertyDisplay/RealPropertyCardContainer",
  () => {
    return function MockRealPropertyCardContainer({ group }) {
      return (
        <div data-testid="real-property-card-container">
          <div data-testid="displayed-doc-id">{group.document_id}</div>
          <div data-testid="has-master-records">
            {group.masterRecords && group.masterRecords.length > 0
              ? "Yes"
              : "No"}
          </div>
          <div data-testid="has-parties-records">
            {group.partiesRecords && group.partiesRecords.length > 0
              ? "Yes"
              : "No"}
          </div>
          <div data-testid="has-legals-records">
            {group.legalsRecords && group.legalsRecords.length > 0
              ? "Yes"
              : "No"}
          </div>
        </div>
      );
    };
  }
);

describe("DocumentIdCrfnSearchDisplay Component", () => {
  // Sample test data
  const singleResult = [
    {
      document_id: "FT-1234567",
      masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
      partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
    },
  ];

  const multipleResults = [
    {
      document_id: "FT-1234567",
      masterRecords: [{ doc_type: "DEED", recorded_borough: "1" }],
      partiesRecords: [{ party_type: "1", name: "TEST NAME" }],
      legalsRecords: [{ borough: "1", block: "123", lot: "45" }],
    },
    {
      document_id: "FT-7654321",
      masterRecords: [{ doc_type: "MORTGAGE", recorded_borough: "2" }],
      partiesRecords: [{ party_type: "2", name: "ANOTHER NAME" }],
      legalsRecords: [{ borough: "2", block: "456", lot: "78" }],
    },
  ];

  // Empty results
  const emptyResults = [];

  test("displays 'No results found' message when results are empty", () => {
    render(<DocumentIdCrfnSearchDisplay results={emptyResults} />);

    // Check for the "No results found" message
    expect(screen.getByText("No results found.")).toBeInTheDocument();

    // DocumentIdMenu and RealPropertyCardContainer should not be rendered
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("real-property-card-container")
    ).not.toBeInTheDocument();
  });

  test("displays 'No results found' message when results are null", () => {
    render(<DocumentIdCrfnSearchDisplay results={null} />);

    // Check for the "No results found" message
    expect(screen.getByText("No results found.")).toBeInTheDocument();

    // DocumentIdMenu and RealPropertyCardContainer should not be rendered
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("real-property-card-container")
    ).not.toBeInTheDocument();
  });

  test("renders document ID menu and card container with a single result", () => {
    render(<DocumentIdCrfnSearchDisplay results={singleResult} />);

    // DocumentIdMenu should be rendered with correct data
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();
    expect(screen.getByTestId("menu-results-count")).toHaveTextContent("1");
    expect(screen.getByTestId("menu-selected-doc-id")).toHaveTextContent(
      "FT-1234567"
    );

    // RealPropertyCardContainer should be rendered with correct data
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id")).toHaveTextContent(
      "FT-1234567"
    );
    expect(screen.getByTestId("has-master-records")).toHaveTextContent("Yes");
    expect(screen.getByTestId("has-parties-records")).toHaveTextContent("Yes");
    expect(screen.getByTestId("has-legals-records")).toHaveTextContent("Yes");
  });

  test("renders document ID menu and card container with multiple results", () => {
    render(<DocumentIdCrfnSearchDisplay results={multipleResults} />);

    // DocumentIdMenu should be rendered with correct data
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();
    expect(screen.getByTestId("menu-results-count")).toHaveTextContent("2");
    expect(screen.getByTestId("menu-selected-doc-id")).toHaveTextContent(
      "FT-1234567"
    );

    // Should have buttons for each document ID
    expect(screen.getByTestId("select-doc-FT-1234567")).toBeInTheDocument();
    expect(screen.getByTestId("select-doc-FT-7654321")).toBeInTheDocument();

    // RealPropertyCardContainer should be rendered with the first result's data initially
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id")).toHaveTextContent(
      "FT-1234567"
    );
  });

  test("changes displayed document when selecting a different document ID", () => {
    render(<DocumentIdCrfnSearchDisplay results={multipleResults} />);

    // Initially displays the first document
    expect(screen.getByTestId("displayed-doc-id")).toHaveTextContent(
      "FT-1234567"
    );

    // Click on the second document ID button
    fireEvent.click(screen.getByTestId("select-doc-FT-7654321"));

    // Should now display the second document
    expect(screen.getByTestId("displayed-doc-id")).toHaveTextContent(
      "FT-7654321"
    );
  });

  test("handles results with missing or empty record arrays", () => {
    const resultsWithMissingData = [
      {
        document_id: "FT-NODATA",
        // No masterRecords, partiesRecords, or legalsRecords
      },
    ];

    render(<DocumentIdCrfnSearchDisplay results={resultsWithMissingData} />);

    // DocumentIdMenu should still be rendered
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();

    // RealPropertyCardContainer should be rendered, but with "No" for all record types
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id")).toHaveTextContent(
      "FT-NODATA"
    );
    expect(screen.getByTestId("has-master-records")).toHaveTextContent("No");
    expect(screen.getByTestId("has-parties-records")).toHaveTextContent("No");
    expect(screen.getByTestId("has-legals-records")).toHaveTextContent("No");
  });
});
