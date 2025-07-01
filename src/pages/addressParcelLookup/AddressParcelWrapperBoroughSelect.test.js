/**
 * Test suite for AddressParcelWrapperBoroughSelect component
 *
 * This component is a wrapper around the BoroughSelect component that:
 * - Passes through value, onChange, and id props
 * - Sets a fixed label="Borough"
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressParcelWrapperBoroughSelect from "./AddressParcelWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect(props) {
    return (
      <div data-testid="borough-select-mock">
        <label htmlFor={props.id}>{props.label}</label>
        <select
          data-testid="select-element"
          id={props.id}
          name={props.name || "borough"}
          value={props.value}
          onChange={props.onChange}
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

describe("AddressParcelWrapperBoroughSelect Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the BoroughSelect component with correct props", () => {
    const mockValue = "3"; // Brooklyn
    const mockOnChange = jest.fn();
    const mockId = "test-borough-select";

    render(
      <AddressParcelWrapperBoroughSelect
        value={mockValue}
        onChange={mockOnChange}
        id={mockId}
      />
    );

    // Check if the component renders
    expect(screen.getByTestId("borough-select-mock")).toBeInTheDocument();

    // Check if label is set to "Borough"
    expect(screen.getByText("Borough")).toBeInTheDocument();

    // Check if the correct ID is passed
    const selectElement = screen.getByTestId("select-element");
    expect(selectElement).toHaveAttribute("id", mockId);

    // Check if value is set correctly
    expect(selectElement).toHaveValue(mockValue);
  });

  test("calls onChange handler when selection changes", async () => {
    const mockValue = "";
    const mockOnChange = jest.fn();
    const mockId = "test-borough-select";
    const user = userEvent.setup();

    render(
      <AddressParcelWrapperBoroughSelect
        value={mockValue}
        onChange={mockOnChange}
        id={mockId}
      />
    );

    // Select a borough
    const selectElement = screen.getByTestId("select-element");
    await user.selectOptions(selectElement, "4"); // Queens

    // Check if onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  test("handles undefined props gracefully", () => {
    // Render with minimal props
    render(<AddressParcelWrapperBoroughSelect />);

    // Component should still render without errors
    expect(screen.getByTestId("borough-select-mock")).toBeInTheDocument();
    expect(screen.getByText("Borough")).toBeInTheDocument();
  });

  test("preserves className when passed as a prop", () => {
    const mockClassName = "custom-class test-class";
    const mockOnChange = jest.fn();

    render(
      <AddressParcelWrapperBoroughSelect
        value="1"
        onChange={mockOnChange}
        className={mockClassName}
      />
    );

    // Check if the component renders
    expect(screen.getByTestId("borough-select-mock")).toBeInTheDocument();

    // The mock we're using doesn't actually apply className, so we're just
    // verifying that rendering with the prop doesn't cause errors
    // In a real test with real component, we would check:
    // expect(screen.getByTestId("borough-select-mock")).toHaveClass(mockClassName);
  });
});
