/**
 * Test suite for the ParcelIdentifierSearchForm component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Form validation for required fields
 * - Form submission with valid inputs
 * - Form error handling
 * - Input field behavior and state updates
 * - URL parameter handling
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ParcelIdentifierSearchForm from "./ParcelIdentifierSearchForm";

// Mock the URL parameters
const mockURLSearchParams = {
  get: jest.fn(),
};

// Save original window.location and URLSearchParams
const originalWindowLocation = window.location;
const originalURLSearchParams = window.URLSearchParams;

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

jest.mock("./ParcelIdentifierWrapperBoroughSelect", () => {
  return function MockParcelIdentifierWrapperBoroughSelect({
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

jest.mock("../../components/acris/legalsForms/TaxBlock", () => {
  return function MockTaxBlock({ value, onChange }) {
    return (
      <div data-testid="tax-block-wrapper">
        <input
          data-testid="tax-block-input"
          type="text"
          name="block"
          value={value}
          onChange={onChange}
          placeholder="Enter Tax Block"
        />
      </div>
    );
  };
});

jest.mock("../../components/acris/legalsForms/TaxLot", () => {
  return function MockTaxLot({ value, onChange }) {
    return (
      <div data-testid="tax-lot-wrapper">
        <input
          data-testid="tax-lot-input"
          type="text"
          name="lot"
          value={value}
          onChange={onChange}
          placeholder="Enter Tax Lot"
        />
      </div>
    );
  };
});

jest.mock("../../components/acris/legalsForms/Unit", () => {
  return function MockUnit({ value, onChange }) {
    return (
      <div data-testid="unit-wrapper">
        <input
          data-testid="unit-input"
          type="text"
          name="unit"
          value={value}
          onChange={onChange}
          placeholder="Enter Unit (optional)"
        />
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
    }) {
      return (
        <div data-testid="doc-class-type-select">
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

describe("ParcelIdentifierSearchForm Component", () => {
  let mockSearchFor;
  let mockSetAlert;

  beforeEach(() => {
    mockSearchFor = jest.fn();
    mockSetAlert = jest.fn();

    // Mock window.location and URLSearchParams
    delete window.location;
    window.location = { search: "?test=value" };
    window.URLSearchParams = jest.fn(() => mockURLSearchParams);

    // Reset URL param mocks for each test
    mockURLSearchParams.get.mockImplementation((param) => {
      return null; // Default to returning null for all params
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original window.location and URLSearchParams
    window.location = originalWindowLocation;
    window.URLSearchParams = originalURLSearchParams;
  });

  describe("Component Rendering", () => {
    test("renders form with all required components and submit button", () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      expect(screen.getByTestId("borough-select-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("tax-block-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("tax-lot-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("unit-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("doc-class-type-select")).toBeInTheDocument();
      expect(
        screen.getByTestId("recorded-date-range-wrapper")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Input Handling", () => {
    test("updates borough when selected", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      expect(boroughSelect).toHaveValue("1");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates tax block when input changes", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const taxBlockInput = screen.getByTestId("tax-block-input");
      await userEvent.type(taxBlockInput, "12345");

      expect(taxBlockInput).toHaveValue("12345");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates tax lot when input changes", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const taxLotInput = screen.getByTestId("tax-lot-input");
      await userEvent.type(taxLotInput, "1234");

      expect(taxLotInput).toHaveValue("1234");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates unit when input changes", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const unitInput = screen.getByTestId("unit-input");
      await userEvent.type(unitInput, "123");

      expect(unitInput).toHaveValue("123");
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("updates date range when selected", async () => {
      render(
        <ParcelIdentifierSearchForm
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
        <ParcelIdentifierSearchForm
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
    test("shows error when submitting without required fields", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Please fill out Borough, Block, and Lot fields."
      );
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("shows error when submitting with only borough filled", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set only borough
      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("shows error when submitting with block and lot but no borough", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set block and lot but not borough
      const taxBlockInput = screen.getByTestId("tax-block-input");
      await userEvent.type(taxBlockInput, "12345");

      const taxLotInput = screen.getByTestId("tax-lot-input");
      await userEvent.type(taxLotInput, "1234");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(mockSearchFor).not.toHaveBeenCalled();
    });

    test("submits form with valid inputs", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Set required fields
      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      const taxBlockInput = screen.getByTestId("tax-block-input");
      await userEvent.type(taxBlockInput, "12345");

      const taxLotInput = screen.getByTestId("tax-lot-input");
      await userEvent.type(taxLotInput, "1234");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
      expect(mockSearchFor).toHaveBeenCalledTimes(1);
      expect(mockSearchFor).toHaveBeenCalledWith(
        {
          recorded_date_range: "to-current-date-default",
          recorded_date_start: "",
          recorded_date_end: "",
          doc_type: "doc-type-default",
          doc_class: "all-classes-default",
        },
        {
          borough: "1",
          block: "12345",
          lot: "1234",
          unit: "",
        }
      );
    });

    test("clears form errors when inputs are changed", async () => {
      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // First trigger validation error
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();

      // Then update a field, which should clear errors
      const boroughSelect = screen.getByTestId("borough-select");
      await userEvent.selectOptions(boroughSelect, "1");

      expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
    });
  });

  describe("URL Parameter Handling", () => {
    test("initializes form with URL parameters if present", async () => {
      // Mock URL parameters for borough, block, and lot
      mockURLSearchParams.get.mockImplementation((param) => {
        if (param === "borough") return "2";
        if (param === "block") return "54321";
        if (param === "lot") return "4321";
        return null;
      });

      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Check if form fields are initialized with URL parameters
      expect(screen.getByTestId("borough-select")).toHaveValue("2");
      expect(screen.getByTestId("tax-block-input")).toHaveValue("54321");
      expect(screen.getByTestId("tax-lot-input")).toHaveValue("4321");
    });

    test("does not initialize form with URL parameters if not present", async () => {
      // Mock no URL parameters
      mockURLSearchParams.get.mockReturnValue(null);

      render(
        <ParcelIdentifierSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Check if form fields are initialized with empty values
      expect(screen.getByTestId("borough-select")).toHaveValue("");
      expect(screen.getByTestId("tax-block-input")).toHaveValue("");
      expect(screen.getByTestId("tax-lot-input")).toHaveValue("");
    });
  });
});
