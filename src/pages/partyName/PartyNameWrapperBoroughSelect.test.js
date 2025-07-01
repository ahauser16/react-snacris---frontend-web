import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartyNameWrapperBoroughSelect from "./PartyNameWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect({ id, value, onChange, required }) {
    return (
      <select
        data-testid="mock-borough-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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

describe("PartyNameWrapperBoroughSelect Component", () => {
  const defaultProps = {
    legalsSearchTerms: { borough: "" },
    handleLegalsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the borough select component", () => {
    render(<PartyNameWrapperBoroughSelect {...defaultProps} />);
    expect(screen.getByTestId("mock-borough-select")).toBeInTheDocument();
  });

  test("updates form data when borough is selected", () => {
    render(<PartyNameWrapperBoroughSelect {...defaultProps} />);

    const select = screen.getByTestId("mock-borough-select");
    fireEvent.change(select, { target: { value: "1" } });

    expect(defaultProps.handleLegalsChange).toHaveBeenCalledWith("1");
  });

  test("handles empty borough selection", () => {
    render(<PartyNameWrapperBoroughSelect {...defaultProps} />);

    const select = screen.getByTestId("mock-borough-select");
    fireEvent.change(select, { target: { value: "" } });

    expect(defaultProps.handleLegalsChange).toHaveBeenCalledWith("");
  });

  test("passes the correct value to handleLegalsChange when updating borough", () => {
    const legalsSearchTerms = {
      borough: "2",
    };

    render(
      <PartyNameWrapperBoroughSelect
        {...defaultProps}
        legalsSearchTerms={legalsSearchTerms}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    fireEvent.change(select, { target: { value: "1" } });

    expect(defaultProps.handleLegalsChange).toHaveBeenCalledWith("1");
  });

  test("passes the initial borough value correctly", () => {
    const legalsSearchTerms = {
      borough: "3",
    };

    render(
      <PartyNameWrapperBoroughSelect
        {...defaultProps}
        legalsSearchTerms={legalsSearchTerms}
      />
    );

    const select = screen.getByTestId("mock-borough-select");
    expect(select).toHaveValue("3");
  });
});
