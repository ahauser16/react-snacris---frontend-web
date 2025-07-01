/**
 * Test suite for ParcelIdentifierSearchDisplay component
 *
 * This component is responsible for:
 * - Displaying a "No results found" message when results are empty
 * - Rendering a menu of document IDs when results are available
 * - Allowing selection of different document IDs
 * - Displaying the details of the selected document
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ParcelIdentifierSearchDisplay from "./ParcelIdentifierSearchDisplay";

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

describe("ParcelIdentifierSearchDisplay Component", () => {
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

  const emptyRecordsResult = [
    {
      document_id: "FT-NODATA",
    },
  ];

  // Test for handling empty results
  test("displays 'No results found' message when results are empty", () => {
    render(<ParcelIdentifierSearchDisplay results={[]} />);

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("real-property-card-container")
    ).not.toBeInTheDocument();
  });

  // Test for handling null results
  test("displays 'No results found' message when results are null", () => {
    render(<ParcelIdentifierSearchDisplay results={null} />);

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByTestId("document-id-menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("real-property-card-container")
    ).not.toBeInTheDocument();
  });

  // Test with a single result
  test("renders correctly with a single result", () => {
    render(<ParcelIdentifierSearchDisplay results={singleResult} />);

    // Document ID menu should be rendered
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();
    expect(screen.getByTestId("menu-results-count").textContent).toBe("1");

    // The selected document ID should be set to the first result by default
    expect(screen.getByTestId("menu-selected-doc-id").textContent).toBe(
      "FT-1234567"
    );

    // The real property card container should be rendered with the correct document
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id").textContent).toBe(
      "FT-1234567"
    );
    expect(screen.getByTestId("has-master-records").textContent).toBe("Yes");
    expect(screen.getByTestId("has-parties-records").textContent).toBe("Yes");
    expect(screen.getByTestId("has-legals-records").textContent).toBe("Yes");
  });

  // Test with multiple results
  test("renders correctly with multiple results and allows selection", () => {
    render(<ParcelIdentifierSearchDisplay results={multipleResults} />);

    // Document ID menu should be rendered
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();
    expect(screen.getByTestId("menu-results-count").textContent).toBe("2");

    // The selected document ID should be set to the first result by default
    expect(screen.getByTestId("menu-selected-doc-id").textContent).toBe(
      "FT-1234567"
    );

    // The real property card container should be rendered with the first document
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id").textContent).toBe(
      "FT-1234567"
    );

    // Test selecting the second document
    fireEvent.click(screen.getByTestId("select-doc-FT-7654321"));

    // The selected document ID should now be the second one
    expect(screen.getByTestId("menu-selected-doc-id").textContent).toBe(
      "FT-7654321"
    );

    // The real property card container should now show the second document
    expect(screen.getByTestId("displayed-doc-id").textContent).toBe(
      "FT-7654321"
    );
  });

  // Test with a result that has no record data
  test("renders correctly with a result that has no record data", () => {
    render(<ParcelIdentifierSearchDisplay results={emptyRecordsResult} />);

    // Document ID menu should be rendered
    expect(screen.getByTestId("document-id-menu")).toBeInTheDocument();

    // The selected document ID should be set to the result
    expect(screen.getByTestId("menu-selected-doc-id").textContent).toBe(
      "FT-NODATA"
    );

    // The real property card container should be rendered with the document
    expect(
      screen.getByTestId("real-property-card-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("displayed-doc-id").textContent).toBe(
      "FT-NODATA"
    );
    expect(screen.getByTestId("has-master-records").textContent).toBe("No");
    expect(screen.getByTestId("has-parties-records").textContent).toBe("No");
    expect(screen.getByTestId("has-legals-records").textContent).toBe("No");
  });
});
