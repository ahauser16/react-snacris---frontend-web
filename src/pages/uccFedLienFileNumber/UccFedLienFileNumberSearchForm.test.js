/**
 * Test suite for the UccFedLienFileNumberSearchForm component
 *
 * This test file covers:
 * - Initial rendering of the form
 * - Form input handling and validation
 * - Form submission
 * - Error handling
 * - Alert functionality
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UccFedLienFileNumberSearchForm from "./UccFedLienFileNumberSearchForm";

// Mock the child components
jest.mock(
  "../../components/acris/personalPropertyForms/UccFileNumInput",
  () => {
    return function MockUccFileNumInput({ value, onChange, id }) {
      return (
        <input
          data-testid="ucc-file-num-input"
          type="text"
          name="ucc_lien_file_number"
          value={value}
          onChange={onChange}
          id={id}
        />
      );
    };
  }
);

jest.mock("./UccFedLienWrapperBoroughSelect", () => {
  return function MockUccFedLienWrapperBoroughSelect({
    legalsSearchTerms,
    handleLegalsChange,
  }) {
    return (
      <select
        data-testid="borough-select"
        name="borough"
        value={legalsSearchTerms.borough}
        onChange={handleLegalsChange}
      >
        <option value="">Select Borough</option>
        <option value="1">Manhattan</option>
        <option value="2">Bronx</option>
      </select>
    );
  };
});

// Mock the Alert component
jest.mock("../../common/Alert", () => {
  return function MockAlert({ type, messages }) {
    return (
      <div data-testid={`alert-${type}`}>
        {messages.map((msg, idx) => (
          <div key={idx} data-testid="alert-message">
            {msg}
          </div>
        ))}
      </div>
    );
  };
});

describe("UccFedLienFileNumberSearchForm Component", () => {
  const mockSearchFor = jest.fn();
  const mockSetAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial rendering
  test("renders form elements correctly", () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    expect(screen.getByTestId("ucc-file-num-input")).toBeInTheDocument();
    expect(screen.getByTestId("borough-select")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  // Test form validation - empty fields
  test("shows validation errors when submitting empty form", async () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    // Submit empty form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Check for validation messages
    expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
    const messages = screen.getAllByTestId("alert-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent("File Number is required");
    expect(messages[1]).toHaveTextContent("Borough is required");

    // Verify searchFor was not called
    expect(mockSearchFor).not.toHaveBeenCalled();
  });

  // Test form input handling
  test("updates form state when inputs change", async () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    // Change file number
    const fileNumInput = screen.getByTestId("ucc-file-num-input");
    await userEvent.type(fileNumInput, "12345");

    // Change borough
    const boroughSelect = screen.getByTestId("borough-select");
    await userEvent.selectOptions(boroughSelect, "1");

    // Verify that alerts and errors are cleared
    expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });

    // Submit form with valid data
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify form submission
    expect(mockSearchFor).toHaveBeenCalledWith(
      { ucc_lien_file_number: "12345" },
      { borough: "1" }
    );
  });

  // Test error clearing on input change
  test("clears errors when input changes", async () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify errors are shown
    expect(screen.getByTestId("alert-danger")).toBeInTheDocument();

    // Type in file number input
    const fileNumInput = screen.getByTestId("ucc-file-num-input");
    await userEvent.type(fileNumInput, "1");

    // Verify errors are cleared
    expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
    expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });

  // Test successful form submission
  test("submits form successfully with valid data", async () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    // Fill out form
    const fileNumInput = screen.getByTestId("ucc-file-num-input");
    const boroughSelect = screen.getByTestId("borough-select");

    await userEvent.type(fileNumInput, "12345");
    await userEvent.selectOptions(boroughSelect, "1");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify form submission
    expect(mockSearchFor).toHaveBeenCalledWith(
      { ucc_lien_file_number: "12345" },
      { borough: "1" }
    );

    // Verify alerts were cleared
    expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });

  // Test whitespace handling in validation
  test("treats whitespace-only input as empty", async () => {
    render(
      <UccFedLienFileNumberSearchForm
        searchFor={mockSearchFor}
        setAlert={mockSetAlert}
      />
    );

    // Fill form with whitespace
    const fileNumInput = screen.getByTestId("ucc-file-num-input");
    await userEvent.type(fileNumInput, "   ");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Check for validation error
    expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
    expect(screen.getAllByTestId("alert-message")[0]).toHaveTextContent(
      "File Number is required"
    );

    // Verify searchFor was not called
    expect(mockSearchFor).not.toHaveBeenCalled();
  });
});
