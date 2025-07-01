/**
 * Test suite for the ParcelIdentifierWrapperBoroughSelect component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Proper prop passing to BoroughSelect
 * - Testing onChange functionality
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ParcelIdentifierWrapperBoroughSelect from "./ParcelIdentifierWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect({
    value,
    onChange,
    name,
    id,
    label,
    required,
  }) {
    return (
      <div data-testid="mock-borough-select">
        <label htmlFor={id || "borough-select"} data-testid="borough-label">
          {label || "Borough"}
        </label>
        <select
          data-testid="borough-select-element"
          name={name || "borough"}
          value={value}
          onChange={onChange}
          aria-required={required}
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

describe("ParcelIdentifierWrapperBoroughSelect Component", () => {
  // Test data
  const mockLegalsSearchTerms = {
    borough: "3",
    block: "1234",
    lot: "56",
  };

  const mockHandleLegalsChange = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(
      <ParcelIdentifierWrapperBoroughSelect
        legalsSearchTerms={mockLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Check that the component renders the mocked BoroughSelect
    expect(screen.getByTestId("mock-borough-select")).toBeInTheDocument();
  });

  test("passes the correct value to BoroughSelect", () => {
    render(
      <ParcelIdentifierWrapperBoroughSelect
        legalsSearchTerms={mockLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Check that the value is passed correctly
    const selectElement = screen.getByTestId("borough-select-element");
    expect(selectElement).toHaveValue("3");
  });

  test("passes the onChange handler to BoroughSelect", () => {
    render(
      <ParcelIdentifierWrapperBoroughSelect
        legalsSearchTerms={mockLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Trigger an onChange event
    const selectElement = screen.getByTestId("borough-select-element");
    fireEvent.change(selectElement, { target: { value: "4" } });

    // Check that the handler was called
    expect(mockHandleLegalsChange).toHaveBeenCalled();
  });

  test("uses empty string when borough is not provided", () => {
    const emptyLegalsSearchTerms = {
      block: "1234",
      lot: "56",
    };

    render(
      <ParcelIdentifierWrapperBoroughSelect
        legalsSearchTerms={emptyLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Check that the select has an empty value
    const selectElement = screen.getByTestId("borough-select-element");
    expect(selectElement).toHaveValue("");
  });

  test("renders with different legalsSearchTerms values", () => {
    const differentLegalsSearchTerms = {
      borough: "5",
      block: "9876",
      lot: "54",
    };

    render(
      <ParcelIdentifierWrapperBoroughSelect
        legalsSearchTerms={differentLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Check that the select has the right value
    const selectElement = screen.getByTestId("borough-select-element");
    expect(selectElement).toHaveValue("5");
  });
});
