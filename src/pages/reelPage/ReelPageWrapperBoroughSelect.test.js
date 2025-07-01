/**
 * Test suite for the ReelPageWrapperBoroughSelect component
 *
 * This test file covers:
 * - Initial rendering of the component with default props
 * - Proper value display from legalsSearchTerms
 * - Change handling and callback propagation
 * - Mock implementation of BoroughSelect to verify prop passing
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReelPageWrapperBoroughSelect from "./ReelPageWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect({ value, onChange }) {
    const handleChange = () => {
      onChange({ target: { value: "1", name: "borough" } });
    };

    return (
      <select
        data-testid="mock-borough-select"
        value={value}
        onChange={handleChange}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
        <option value="3">Brooklyn</option>
        <option value="4">Queens</option>
        <option value="5">Staten Island</option>
      </select>
    );
  };
});

describe("ReelPageWrapperBoroughSelect Component", () => {
  const mockHandleLegalsChange = jest.fn();
  const defaultLegalsSearchTerms = { borough: "" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial rendering
  test("renders with empty initial value", () => {
    render(
      <ReelPageWrapperBoroughSelect
        legalsSearchTerms={defaultLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("");
  });

  // Test with a pre-selected value
  test("renders with pre-selected borough value", () => {
    render(
      <ReelPageWrapperBoroughSelect
        legalsSearchTerms={{ borough: "1" }}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("1");
  });

  // Test change handler
  test("calls handleLegalsChange when selection changes", () => {
    render(
      <ReelPageWrapperBoroughSelect
        legalsSearchTerms={defaultLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    fireEvent.change(select, { target: { value: "1", name: "borough" } });

    expect(mockHandleLegalsChange).toHaveBeenCalled();
  });

  // Test with undefined props
  test("handles undefined legalsSearchTerms gracefully", () => {
    // Component should use default value for legalsSearchTerms
    render(
      <ReelPageWrapperBoroughSelect
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("");
  });
});
