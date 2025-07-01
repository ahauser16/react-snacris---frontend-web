/**
 * Test suite for the PartyNameSearchForm component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Form validation for required fields
 * - Form submission with valid inputs
 * - Form error handling
 * - Input field behavior and state updates
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartyNameSearchForm from "./PartyNameSearchForm";
import "@testing-library/jest-dom";

// Mock child components
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

jest.mock("../../components/acris/partyForms/PartyName", () => {
  return function MockPartyName({ value, onChange, id, required }) {
    return (
      <div data-testid="party-name-input">
        <input
          type="text"
          value={value}
          onChange={onChange}
          name="name"
          id={id}
          required={required}
          data-testid="party-name-field"
          placeholder="Enter party name"
        />
      </div>
    );
  };
});

jest.mock(
  "../../components/acris/documentControlCodeForms/DocClassTypePartySelect",
  () => {
    return function MockDocClassTypePartySelect({
      masterSearchTerms,
      setMasterSearchTerms,
      partySearchTerms,
      setPartySearchTerms,
    }) {
      return (
        <div data-testid="doc-class-type-party-select">
          <select
            data-testid="doc-class-select"
            name="doc_class"
            value={masterSearchTerms.doc_class}
            onChange={(e) => {
              setMasterSearchTerms({
                ...masterSearchTerms,
                doc_class: e.target.value,
              });
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
              setMasterSearchTerms({
                ...masterSearchTerms,
                doc_type: e.target.value,
              });
            }}
          >
            <option value="doc-type-default">Select Document Type</option>
            <option value="DEED">DEED</option>
            <option value="MORTGAGE">MORTGAGE</option>
          </select>

          <select
            data-testid="party-type-select"
            name="party_type"
            value={partySearchTerms.party_type}
            onChange={(e) => {
              setPartySearchTerms({
                ...partySearchTerms,
                party_type: e.target.value,
              });
            }}
          >
            <option value="all-party-types-default">Select Party Type</option>
            <option value="1">Party Type 1</option>
            <option value="2">Party Type 2</option>
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

jest.mock("./PartyNameWrapperBoroughSelect", () => {
  return function MockPartyNameWrapperBoroughSelect({
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

describe("PartyNameSearchForm Component", () => {
  const mockSearchFor = jest.fn();
  const mockSetAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with all required components", () => {
    render(
      <PartyNameSearchForm searchFor={mockSearchFor} setAlert={mockSetAlert} />
    );

    expect(screen.getByTestId("party-name-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("recorded-date-range-wrapper")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("doc-class-type-party-select")
    ).toBeInTheDocument();
    expect(screen.getByTestId("borough-select-wrapper")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("shows error when submitting without party name", async () => {
    render(
      <PartyNameSearchForm searchFor={mockSearchFor} setAlert={mockSetAlert} />
    );

    // Submit form without entering party name
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
    expect(screen.getByTestId("alert-message")).toHaveTextContent(
      "The name field is required."
    );
    expect(mockSearchFor).not.toHaveBeenCalled();
  });

  test("submits form with valid data", async () => {
    render(
      <PartyNameSearchForm searchFor={mockSearchFor} setAlert={mockSetAlert} />
    );

    // Fill in party name
    const nameInput = screen.getByTestId("party-name-field");
    await userEvent.type(nameInput, "John Smith");

    // Change document class and type
    const docClassSelect = screen.getByTestId("doc-class-select");
    await userEvent.selectOptions(docClassSelect, "DEED");

    const docTypeSelect = screen.getByTestId("doc-type-select");
    await userEvent.selectOptions(docTypeSelect, "DEED");

    // Change party type
    const partyTypeSelect = screen.getByTestId("party-type-select");
    await userEvent.selectOptions(partyTypeSelect, "1");

    // Select borough
    const boroughSelect = screen.getByTestId("borough-select");
    await userEvent.selectOptions(boroughSelect, "1");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Check if searchFor was called with correct parameters
    expect(mockSearchFor).toHaveBeenCalledWith(
      {
        recorded_date_range: "to-current-date-default",
        recorded_date_start: "",
        recorded_date_end: "",
        doc_type: "DEED",
        doc_class: "DEED",
      },
      {
        name: "John Smith",
        party_type: "1",
      },
      {
        borough: "1",
      }
    );
  });

  test("clears form errors when inputs change", async () => {
    render(
      <PartyNameSearchForm searchFor={mockSearchFor} setAlert={mockSetAlert} />
    );

    // Submit form to trigger error
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(screen.getByTestId("alert-danger")).toBeInTheDocument();

    // Enter party name
    const nameInput = screen.getByTestId("party-name-field");
    await userEvent.type(nameInput, "John Smith");

    // Error should be cleared
    expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
    expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });

  test("handles date range changes", async () => {
    render(
      <PartyNameSearchForm searchFor={mockSearchFor} setAlert={mockSetAlert} />
    );

    // Change date range to custom
    const dateRangeSelect = screen.getByTestId("recorded-date-range-select");
    await userEvent.selectOptions(dateRangeSelect, "custom-range");

    // Custom date inputs should appear
    expect(screen.getByTestId("custom-date-inputs")).toBeInTheDocument();
    expect(screen.getByTestId("recorded-date-start")).toBeInTheDocument();
    expect(screen.getByTestId("recorded-date-end")).toBeInTheDocument();

    // Enter dates
    const startDate = screen.getByTestId("recorded-date-start");
    const endDate = screen.getByTestId("recorded-date-end");
    await userEvent.type(startDate, "2023-01-01");
    await userEvent.type(endDate, "2023-12-31");

    // Fill required field (party name)
    const nameInput = screen.getByTestId("party-name-field");
    await userEvent.type(nameInput, "John Smith");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Check if searchFor was called with correct dates
    expect(mockSearchFor).toHaveBeenCalledWith(
      expect.objectContaining({
        recorded_date_range: "custom-range",
        recorded_date_start: "2023-01-01",
        recorded_date_end: "2023-12-31",
      }),
      expect.any(Object),
      expect.any(Object)
    );
  });
});
