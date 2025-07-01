/**
 * Test suite for the DocumentTypeSearchForm component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Form validation for required fields
 * - Form submission with valid inputs
 * - Form error handling
 * - Input field behavior and state updates
 * - Alert message display
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DocumentTypeSearchForm from "./DocumentTypeSearchForm";

// Mock the child components
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

jest.mock(
  "../../components/acris/documentControlCodeForms/DocClassTypeSelect",
  () => {
    return function MockDocClassTypeSelect({
      masterSearchTerms,
      setMasterSearchTerms,
      onChange,
    }) {
      return (
        <div data-testid="doc-class-type-select">
          <select
            data-testid="doc-class-select"
            name="doc_class"
            value={masterSearchTerms.doc_class}
            onChange={(e) => {
              onChange(e);
            }}
          >
            <option value="all-classes-default">Select Document Class</option>
            <option value="DEED">DEED</option>
            <option value="MORTGAGE">MORTGAGE</option>
          </select>

          <select
            data-testid="doc-type-select"
            name="doc_type"
            value={masterSearchTerms.doc_type}
            onChange={(e) => {
              onChange(e);
            }}
          >
            <option value="doc-type-default">Select Document Type</option>
            <option value="DEED">DEED</option>
            <option value="MORTGAGE">MORTGAGE</option>
          </select>
        </div>
      );
    };
  }
);

jest.mock("../../components/acris/masterForms/RecordedDateRangeWrapper", () => {
  return function MockRecordedDateRangeWrapper({
    masterSearchTerms,
    setMasterSearchTerms,
  }) {
    return (
      <div data-testid="recorded-date-range-wrapper">
        <select
          data-testid="recorded-date-range-select"
          name="recorded_date_range"
          value={masterSearchTerms.recorded_date_range}
          onChange={(e) => {
            setMasterSearchTerms({
              ...masterSearchTerms,
              recorded_date_range: e.target.value,
            });
          }}
        >
          <option value="to-current-date-default">To Current Date</option>
          <option value="last-month">Last Month</option>
          <option value="custom-range">Custom Range</option>
        </select>

        {masterSearchTerms.recorded_date_range === "custom-range" && (
          <div data-testid="custom-date-inputs">
            <input
              data-testid="recorded-date-start"
              name="recorded_date_start"
              type="date"
              value={masterSearchTerms.recorded_date_start}
              onChange={(e) => {
                setMasterSearchTerms({
                  ...masterSearchTerms,
                  recorded_date_start: e.target.value,
                });
              }}
            />
            <input
              data-testid="recorded-date-end"
              name="recorded_date_end"
              type="date"
              value={masterSearchTerms.recorded_date_end}
              onChange={(e) => {
                setMasterSearchTerms({
                  ...masterSearchTerms,
                  recorded_date_end: e.target.value,
                });
              }}
            />
          </div>
        )}
      </div>
    );
  };
});

jest.mock("./DocumentTypeSearchWrapperBoroughSelect", () => {
  return function MockDocumentTypeSearchWrapperBoroughSelect({
    legalsSearchTerms,
    handleLegalsChange,
  }) {
    return (
      <div data-testid="borough-select-wrapper">
        <select
          data-testid="borough-select"
          name="borough"
          value={legalsSearchTerms.borough}
          onChange={handleLegalsChange}
        >
          <option value="">Select Borough</option>
          <option value="1">Manhattan</option>
          <option value="2">Bronx</option>
          <option value="3">Brooklyn</option>
          <option value="4">Queens</option>
          <option value="5">Staten Island</option>
        </select>
      </div>
    );
  };
});

describe("DocumentTypeSearchForm Component", () => {
  let mockSearchFor;
  let mockSetAlert;

  beforeEach(() => {
    mockSearchFor = jest.fn();
    mockSetAlert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("renders form with all required components and submit button", () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      expect(screen.getByTestId("doc-class-type-select")).toBeInTheDocument();
      expect(
        screen.getByTestId("recorded-date-range-wrapper")
      ).toBeInTheDocument();
      expect(screen.getByTestId("borough-select-wrapper")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Input Handling", () => {
    test("updates doc class when selected", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const docClassSelect = screen.getByTestId("doc-class-select");
      await userEvent.selectOptions(docClassSelect, "DEED");

      expect(docClassSelect).toHaveValue("DEED");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates doc type when selected", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const docTypeSelect = screen.getByTestId("doc-type-select");
      await userEvent.selectOptions(docTypeSelect, "DEED");

      expect(docTypeSelect).toHaveValue("DEED");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates borough when selected", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      expect(boroughSelect).toHaveValue("1");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates date range when selected", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const dateRangeSelect = screen.getByTestId("recorded-date-range-select");
      await userEvent.selectOptions(dateRangeSelect, "last-month");

      expect(dateRangeSelect).toHaveValue("last-month");
    });

    test("shows custom date inputs when custom range is selected", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const dateRangeSelect = screen.getByTestId("recorded-date-range-select");
      await userEvent.selectOptions(dateRangeSelect, "custom-range");

      expect(screen.getByTestId("custom-date-inputs")).toBeInTheDocument();
      expect(screen.getByTestId("recorded-date-start")).toBeInTheDocument();
      expect(screen.getByTestId("recorded-date-end")).toBeInTheDocument();
    });
  });

  describe("Form Validation and Submission", () => {
    test("shows error when submitting with default document class and type", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Please select both a Document Class and a Document Type."
      );
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("shows error when submitting with default document class", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set doc type but leave doc class as default
      const docTypeSelect = screen.getByTestId("doc-type-select");
      await userEvent.selectOptions(docTypeSelect, "DEED");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("shows error when submitting with default document type", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set doc class but leave doc type as default
      const docClassSelect = screen.getByTestId("doc-class-select");
      await userEvent.selectOptions(docClassSelect, "DEED");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("submits form with valid inputs", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set required fields
      const docClassSelect = screen.getByTestId("doc-class-select");
      await userEvent.selectOptions(docClassSelect, "DEED");

      const docTypeSelect = screen.getByTestId("doc-type-select");
      await userEvent.selectOptions(docTypeSelect, "DEED");

      // Set optional borough
      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
      expect(mockSearchFor).toHaveBeenCalledTimes(1);
      expect(mockSearchFor).toHaveBeenCalledWith(
        {
          recorded_date_range: "to-current-date-default",
          recorded_date_start: "",
          recorded_date_end: "",
          doc_type: "DEED",
          doc_class: "DEED",
        },
        {
          borough: "1",
        }
      );
    });

    test("clears form errors when inputs are changed", async () => {
      render(
        <DocumentTypeSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // First trigger validation error
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();

      // Then update a field, which should clear errors
      const docClassSelect = screen.getByTestId("doc-class-select");
      await userEvent.selectOptions(docClassSelect, "DEED");

      expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
    });
  });
});
