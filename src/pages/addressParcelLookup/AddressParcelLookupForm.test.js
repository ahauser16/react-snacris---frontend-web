/**
 * Test suite for AddressParcelLookupForm component
 *
 * This component provides a form for users to search for a property by:
 * - Address (borough, street number, street name, optional unit)
 * - BBL (borough, block, lot)
 *
 * The form enforces rules that users must fill out either the address or BBL fields, but not both.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressParcelLookupForm from "./AddressParcelLookupForm";

// Mock the imported components
jest.mock("../../common/Alert", () => {
  return function MockAlert({ type, messages }) {
    return (
      <div data-testid="mock-alert" data-type={type}>
        {messages.map((msg, idx) => (
          <div key={idx} data-testid="alert-message">
            {msg}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("./AddressParcelWrapperBoroughSelect", () => {
  return function MockBoroughSelect({ value, onChange, id }) {
    return (
      <div data-testid={`mock-borough-select-${id}`}>
        <select
          data-testid={`borough-select-${id}`}
          name="borough"
          value={value}
          onChange={onChange}
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

// Mock StreetNumber component
jest.mock("../../components/acris/legalsForms/StreetNumber", () => {
  return function MockStreetNumber({ value, onChange, id }) {
    return (
      <div data-testid={`mock-street-number-${id}`}>
        <input
          data-testid="street_number"
          name="street_number"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
});

// Mock StreetName component
jest.mock("../../components/acris/legalsForms/StreetName", () => {
  return function MockStreetName({ value, onChange, id }) {
    return (
      <div data-testid={`mock-street-name-${id}`}>
        <input
          data-testid="street_name"
          name="street_name"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
});

// Mock Unit component
jest.mock("../../components/acris/legalsForms/Unit", () => {
  return function MockUnit({ value, onChange, id }) {
    return (
      <div data-testid={`mock-unit-${id}`}>
        <input
          data-testid="unit"
          name="unit"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
});

// Mock TaxBlock component
jest.mock("../../components/acris/legalsForms/TaxBlock", () => {
  return function MockTaxBlock({ value, onChange, id }) {
    return (
      <div data-testid={`mock-tax-block-${id}`}>
        <input
          data-testid="block"
          name="block"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
});

// Mock TaxLot component
jest.mock("../../components/acris/legalsForms/TaxLot", () => {
  return function MockTaxLot({ value, onChange, id }) {
    return (
      <div data-testid={`mock-tax-lot-${id}`}>
        <input data-testid="lot" name="lot" value={value} onChange={onChange} />
      </div>
    );
  };
});

describe("AddressParcelLookupForm Component", () => {
  // Mock props
  const searchFor = jest.fn();
  const setAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form with both address and BBL sections", () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Check for section headers
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Borough, Block & Lot")).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByText("Submit")).toBeInTheDocument();

    // Check for the address form components
    expect(
      screen.getByTestId("mock-borough-select-address-borough")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-street-number-address-street-number")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-street-name-address-street-name")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-unit-address-unit")).toBeInTheDocument();

    // Check for the BBL form components
    expect(
      screen.getByTestId("mock-borough-select-bbl-borough")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-tax-block-bbl-block")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tax-lot-bbl-lot")).toBeInTheDocument();
  });

  test("shows error when both address and BBL sections are partially filled", async () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Fill part of the address section
    fireEvent.change(screen.getByTestId("borough-select-address-borough"), {
      target: { value: "1" },
    });

    // Fill part of the BBL section
    fireEvent.change(screen.getByTestId("borough-select-bbl-borough"), {
      target: { value: "2" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    // Check error message
    expect(screen.getByTestId("mock-alert")).toBeInTheDocument();
    expect(screen.getByTestId("alert-message")).toHaveTextContent(
      "Please fill out either the Property Address or Property Borough, Block & Lot fields."
    );

    // searchFor should not have been called
    expect(searchFor).not.toHaveBeenCalled();
  });

  test("shows error when both address and BBL sections are fully filled", async () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Fill the address section
    fireEvent.change(screen.getByTestId("borough-select-address-borough"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("street_number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId("street_name"), {
      target: { value: "Main St" },
    });

    // Fill the BBL section
    fireEvent.change(screen.getByTestId("borough-select-bbl-borough"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByTestId("block"), {
      target: { value: "456" },
    });
    fireEvent.change(screen.getByTestId("lot"), {
      target: { value: "789" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    // Check error message
    expect(screen.getByTestId("mock-alert")).toBeInTheDocument();
    expect(screen.getByTestId("alert-message")).toHaveTextContent(
      "Submit the form with either Property Address or Property Borough, Block & Lot but not both."
    );

    // searchFor should not have been called
    expect(searchFor).not.toHaveBeenCalled();
  });

  test("calls searchFor with address data when address section is filled", async () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Fill the address section
    fireEvent.change(screen.getByTestId("borough-select-address-borough"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("street_number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId("street_name"), {
      target: { value: "Main St" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    // No error message should be shown
    expect(screen.queryByTestId("mock-alert")).not.toBeInTheDocument();

    // searchFor should have been called with address data
    expect(searchFor).toHaveBeenCalledWith({
      borough: "1",
      street_number: "123",
      street_name: "Main St",
      unit: "",
      block: "",
      lot: "",
    });
  });

  test("calls searchFor with BBL data when BBL section is filled", async () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Fill the BBL section
    fireEvent.change(screen.getByTestId("borough-select-bbl-borough"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByTestId("block"), {
      target: { value: "456" },
    });
    fireEvent.change(screen.getByTestId("lot"), {
      target: { value: "789" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    // No error message should be shown
    expect(screen.queryByTestId("mock-alert")).not.toBeInTheDocument();

    // searchFor should have been called with BBL data
    expect(searchFor).toHaveBeenCalledWith({
      borough: "2",
      street_number: "",
      street_name: "",
      unit: "",
      block: "456",
      lot: "789",
    });
  });

  test("clears form errors when input changes", () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Submit the form with no data to trigger an error
    fireEvent.click(screen.getByText("Submit"));

    // Error should be shown
    expect(screen.getByTestId("mock-alert")).toBeInTheDocument();

    // Change an input to clear the error
    fireEvent.change(screen.getByTestId("borough-select-address-borough"), {
      target: { value: "1" },
    });

    // Error should be cleared
    expect(screen.queryByTestId("mock-alert")).not.toBeInTheDocument();

    // setAlert should have been called to clear alerts
    expect(setAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });

  test("sets alert to empty before search", async () => {
    render(
      <AddressParcelLookupForm searchFor={searchFor} setAlert={setAlert} />
    );

    // Fill the address section
    fireEvent.change(screen.getByTestId("borough-select-address-borough"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("street_number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId("street_name"), {
      target: { value: "Main St" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    // setAlert should have been called to clear alerts before search
    expect(setAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });
});
