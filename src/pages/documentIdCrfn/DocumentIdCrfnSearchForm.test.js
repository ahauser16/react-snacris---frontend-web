/**
 * Test suite for the DocumentIdCrfnSearchForm component
 *
 * This test file covers the following scenarios:
 * - Initial rendering of the component
 * - Form submission with valid document ID
 * - Form submission with valid CRFN
 * - Form submission with both fields filled (error case)
 * - Form submission with no fields filled (error case)
 * - Form input field behavior and validation
 * - Alert message display
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DocumentIdCrfnSearchForm from "./DocumentIdCrfnSearchForm";

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

jest.mock("../../components/acris/masterForms/DocumentIdTextInput", () => {
  return function MockDocumentIdTextInput({ value, onChange }) {
    return (
      <div data-testid="document-id-input">
        <input
          data-testid="document-id-field"
          name="document_id"
          value={value}
          onChange={onChange}
          placeholder="Document ID"
        />
      </div>
    );
  };
});

jest.mock("../../components/acris/masterForms/CrfnTextInput", () => {
  return function MockCrfnTextInput({ value, onChange }) {
    return (
      <div data-testid="crfn-input">
        <input
          data-testid="crfn-field"
          name="crfn"
          value={value}
          onChange={onChange}
          placeholder="CRFN"
        />
      </div>
    );
  };
});

describe("DocumentIdCrfnSearchForm Component", () => {
  let mockSearchFor;
  let mockSetAlert;

  beforeEach(() => {
    mockSearchFor = jest.fn();
    mockSetAlert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("renders form with document ID and CRFN inputs and submit button", () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      expect(screen.getByTestId("document-id-input")).toBeInTheDocument();
      expect(screen.getByTestId("crfn-input")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Input Handling", () => {
    test("updates document ID input when typing", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const documentIdInput = screen.getByTestId("document-id-field");
      await userEvent.type(documentIdInput, "2022012345678901");

      expect(documentIdInput).toHaveValue("2022012345678901");
    });

    test("updates CRFN input when typing", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const crfnInput = screen.getByTestId("crfn-field");
      await userEvent.type(crfnInput, "2022012345678");

      expect(crfnInput).toHaveValue("2022012345678");
    });

    test("clears document ID when CRFN is entered", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const documentIdInput = screen.getByTestId("document-id-field");
      const crfnInput = screen.getByTestId("crfn-field");

      // First enter document ID
      await userEvent.type(documentIdInput, "2022012345678901");
      expect(documentIdInput).toHaveValue("2022012345678901");

      // Then enter CRFN - document ID should be cleared
      await userEvent.type(crfnInput, "2022012345678");
      expect(documentIdInput).toHaveValue("");
      expect(crfnInput).toHaveValue("2022012345678");
    });

    test("clears CRFN when document ID is entered", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const documentIdInput = screen.getByTestId("document-id-field");
      const crfnInput = screen.getByTestId("crfn-field");

      // First enter CRFN
      await userEvent.type(crfnInput, "2022012345678");
      expect(crfnInput).toHaveValue("2022012345678");

      // Then enter document ID - CRFN should be cleared
      await userEvent.type(documentIdInput, "2022012345678901");
      expect(crfnInput).toHaveValue("");
      expect(documentIdInput).toHaveValue("2022012345678901");
    });
  });

  describe("Form Submission", () => {
    test("calls searchFor with document ID when submitted with valid document ID", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const documentIdInput = screen.getByTestId("document-id-field");
      await userEvent.type(documentIdInput, "2022012345678901");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(mockSearchFor).toHaveBeenCalledTimes(1);
      expect(mockSearchFor).toHaveBeenCalledWith({
        document_id: "2022012345678901",
      });
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("calls searchFor with CRFN when submitted with valid CRFN", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      const crfnInput = screen.getByTestId("crfn-field");
      await userEvent.type(crfnInput, "2022012345678");

      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      expect(mockSearchFor).toHaveBeenCalledTimes(1);
      expect(mockSearchFor).toHaveBeenCalledWith({ crfn: "2022012345678" });
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });

    test("validates that either document ID or CRFN must be provided", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Submit the form without entering any data
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      // Check that the error is displayed
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Please fill out either the Document ID or CRFN field."
      );

      // Verify searchFor was not called
      expect(mockSearchFor).not.toHaveBeenCalled();
    });
  });

  describe("Alert Handling", () => {
    test("clears form errors when input changes", async () => {
      render(
        <DocumentIdCrfnSearchForm
          searchFor={mockSearchFor}
          setAlert={mockSetAlert}
        />
      );

      // Submit form to trigger error
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify error is shown
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();

      // Enter input to clear error
      const documentIdInput = screen.getByTestId("document-id-field");
      await userEvent.type(documentIdInput, "2");

      // Verify error is cleared
      expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
      expect(mockSetAlert).toHaveBeenCalledWith({ type: "", messages: [] });
    });
  });
});
