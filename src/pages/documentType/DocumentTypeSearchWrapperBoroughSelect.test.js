import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DocumentTypeSearchWrapperBoroughSelect from "./DocumentTypeSearchWrapperBoroughSelect";

// Mock the BoroughSelect component
jest.mock("../../components/acris/legalsForms/BoroughSelect", () => {
  return function MockBoroughSelect({ value, onChange }) {
    return (
      <select data-testid="borough-select" value={value} onChange={onChange}>
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

describe("DocumentTypeSearchWrapperBoroughSelect Component", () => {
  test("renders BoroughSelect with correct props", () => {
    // Prepare mock props
    const mockLegalsSearchTerms = { borough: "3" };
    const mockHandleLegalsChange = jest.fn();

    // Render the component
    render(
      <DocumentTypeSearchWrapperBoroughSelect
        legalsSearchTerms={mockLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Verify the BoroughSelect was rendered with correct props
    const boroughSelect = screen.getByTestId("borough-select");
    expect(boroughSelect).toBeInTheDocument();
    expect(boroughSelect).toHaveValue("3");
  });

  test("calls handleLegalsChange when borough is changed", async () => {
    // Prepare mock props
    const mockLegalsSearchTerms = { borough: "" };
    const mockHandleLegalsChange = jest.fn();

    // Render the component
    render(
      <DocumentTypeSearchWrapperBoroughSelect
        legalsSearchTerms={mockLegalsSearchTerms}
        handleLegalsChange={mockHandleLegalsChange}
      />
    );

    // Get the select element
    const boroughSelect = screen.getByTestId("borough-select");

    // Change the selection
    await userEvent.selectOptions(boroughSelect, "2");

    // Verify the change handler was called
    expect(mockHandleLegalsChange).toHaveBeenCalled();
  });
});
