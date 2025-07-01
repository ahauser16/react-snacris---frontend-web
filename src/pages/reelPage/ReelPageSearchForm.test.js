/**
 * Test suite for the ReelPageSearchForm component
 *
 * This test file covers:
 * - Initial rendering of form elements
 * - Form input handling and state updates
 * - Form validation
 * - Form submission
 * - Alert handling
 * - Error handling
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReelPageSearchForm from "./ReelPageSearchForm";

// Mock the child components
jest.mock("../../components/acris/masterForms/ReelYearInput", () => {
  return function MockReelYearInput({ value, onChange }) {
    return (
      <input
        data-testid="reel-year-input"
        name="reel_yr"
        value={value}
        onChange={onChange}
      />
    );
  };
});

jest.mock("../../components/acris/masterForms/ReelNumInput", () => {
  return function MockReelNumInput({ value, onChange }) {
    return (
      <input
        data-testid="reel-num-input"
        name="reel_nbr"
        value={value}
        onChange={onChange}
      />
    );
  };
});

jest.mock("../../components/acris/masterForms/ReelPageNumInput", () => {
  return function MockReelPageNumInput({ value, onChange }) {
    return (
      <input
        data-testid="reel-page-input"
        name="reel_pg"
        value={value}
        onChange={onChange}
      />
    );
  };
});

jest.mock("./ReelPageWrapperBoroughSelect", () => {
  return function MockReelPageWrapperBoroughSelect({
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

describe("ReelPageSearchForm Component", () => {
  const searchFor = jest.fn();
  const setAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial rendering
  test("renders form elements correctly", () => {
    render(<ReelPageSearchForm searchFor={searchFor} setAlert={setAlert} />);

    expect(screen.getByTestId("reel-year-input")).toBeInTheDocument();
    expect(screen.getByTestId("reel-num-input")).toBeInTheDocument();
    expect(screen.getByTestId("reel-page-input")).toBeInTheDocument();
    expect(screen.getByTestId("borough-select")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  // Test form input handling
  test("updates form state when inputs change", async () => {
    render(<ReelPageSearchForm searchFor={searchFor} setAlert={setAlert} />);

    // Change reel year
    const yearInput = screen.getByTestId("reel-year-input");
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2000");

    // Change reel number
    const numInput = screen.getByTestId("reel-num-input");
    await userEvent.clear(numInput);
    await userEvent.type(numInput, "123");

    // Change page number
    const pageInput = screen.getByTestId("reel-page-input");
    await userEvent.clear(pageInput);
    await userEvent.type(pageInput, "45");

    // Change borough
    const boroughSelect = screen.getByTestId("borough-select");
    await userEvent.selectOptions(boroughSelect, "1");

    // Verify that alerts and errors are cleared
    await waitFor(() => {
      expect(setAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });
  });

  // Test form validation
  test("shows validation errors when submitting empty form", async () => {
    render(<ReelPageSearchForm searchFor={searchFor} setAlert={setAlert} />);

    // Submit empty form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      const messages = screen.getAllByTestId("alert-message");
      expect(messages).toHaveLength(4); // All fields are required
      expect(messages[0]).toHaveTextContent("Reel Year is required");
      expect(messages[1]).toHaveTextContent("Reel Number is required");
      expect(messages[2]).toHaveTextContent("Page Number is required");
      expect(messages[3]).toHaveTextContent("Borough is required");
    });

    // Verify searchFor was not called
    expect(searchFor).not.toHaveBeenCalled();
  });

  // Test successful form submission
  test("submits form successfully with valid data", async () => {
    render(<ReelPageSearchForm searchFor={searchFor} setAlert={setAlert} />);

    // Fill out form with async/await to ensure state updates
    const yearInput = screen.getByTestId("reel-year-input");
    const numInput = screen.getByTestId("reel-num-input");
    const pageInput = screen.getByTestId("reel-page-input");
    const boroughSelect = screen.getByTestId("borough-select");

    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2000");
    await userEvent.clear(numInput);
    await userEvent.type(numInput, "123");
    await userEvent.clear(pageInput);
    await userEvent.type(pageInput, "45");
    await userEvent.selectOptions(boroughSelect, "1");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify form submission
    await waitFor(
      () => {
        expect(searchFor).toHaveBeenCalledWith(
          {
            reel_yr: "2000",
            reel_nbr: "123",
            reel_pg: "45",
          },
          {
            borough: "1",
          }
        );
      },
      { timeout: 3000 }
    );

    // Verify alerts were cleared
    expect(setAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });

  // Test error clearing
  test("clears errors when input changes", async () => {
    render(<ReelPageSearchForm searchFor={searchFor} setAlert={setAlert} />);

    // Submit empty form to trigger errors
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Verify errors are shown
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
    });

    // Type in an input
    userEvent.type(screen.getByTestId("reel-year-input"), "2000");

    // Verify errors are cleared
    await waitFor(() => {
      expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
    });

    // Verify alert was cleared
    expect(setAlert).toHaveBeenCalledWith({ type: "", messages: [] });
  });
});
