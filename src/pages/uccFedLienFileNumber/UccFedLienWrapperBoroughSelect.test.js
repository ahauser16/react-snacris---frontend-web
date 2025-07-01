/**
 * Test suite for the UccFedLienWrapperBoroughSelect component
 *
 * This test file covers:
 * - Initial rendering with default props
 * - Proper value display from legalsSearchTerms
 * - Change handler functionality
 * - Mock implementation of BoroughSelect
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UccFedLienWrapperBoroughSelect from "./UccFedLienWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect({ value, onChange }) {
    const handleChange = (e) => {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: "borough",
          value: e.target.value,
        },
      };
      onChange(syntheticEvent);
    };

    return (
      <select
        data-testid="mock-borough-select"
        name="borough"
        value={value || ""}
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

describe("UccFedLienWrapperBoroughSelect Component", () => {
  const mockHandleLegalsChange = jest.fn();
  const defaultLegalsSearchTerms = { borough: "" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial rendering
  test("renders with empty initial value", () => {
    render(
      <UccFedLienWrapperBoroughSelect
        legalsSearchTerms={defaultLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("");
  });

  // Test with pre-selected value
  test("renders with pre-selected borough value", () => {
    render(
      <UccFedLienWrapperBoroughSelect
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
      <UccFedLienWrapperBoroughSelect
        legalsSearchTerms={defaultLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    const mockEvent = {
      target: {
        name: "borough",
        value: "1",
      },
    };

    fireEvent.change(select, mockEvent);

    expect(mockHandleLegalsChange).toHaveBeenCalledTimes(1);
    const receivedEvent = mockHandleLegalsChange.mock.calls[0][0];
    expect(receivedEvent.target.name).toBe("borough");
    expect(receivedEvent.target.value).toBe("1");
  });

  // Test with undefined props
  test("handles undefined legalsSearchTerms gracefully", () => {
    // This should not throw an error
    render(
      <UccFedLienWrapperBoroughSelect
        legalsSearchTerms={undefined}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("");
  });

  // Test selecting different boroughs
  test("handles selection of different boroughs", () => {
    render(
      <UccFedLienWrapperBoroughSelect
        legalsSearchTerms={defaultLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    const select = screen.getByTestId("mock-borough-select");

    // Test Manhattan selection
    fireEvent.change(select, { target: { value: "1" } });
    expect(mockHandleLegalsChange.mock.calls[0][0].target.value).toBe("1");

    // Test Brooklyn selection
    fireEvent.change(select, { target: { value: "3" } });
    expect(mockHandleLegalsChange.mock.calls[1][0].target.value).toBe("3");
  });
});
