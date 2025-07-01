import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchForm from "./SearchForm";

// Helper function to get the form by role with name
const getSearchForm = () => screen.getByRole("form", { name: "search-form" });

describe("SearchForm", () => {
  let mockSearchFor;

  beforeEach(() => {
    mockSearchFor = jest.fn();
    // Clear console.debug mock if it exists
    if (console.debug.mockClear) {
      console.debug.mockClear();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("renders search form with input and submit button", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      expect(
        screen.getByPlaceholderText("Enter search term..")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    test("renders with correct CSS classes", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const form = getSearchForm();
      const input = screen.getByPlaceholderText("Enter search term..");
      const button = screen.getByRole("button", { name: /submit/i });

      expect(form.closest(".SearchForm")).toBeInTheDocument();
      expect(input).toHaveClass("form-control", "form-control-lg");
      expect(button).toHaveClass("btn", "btn-lg", "btn-primary");
    });

    test("input has correct attributes", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      expect(input).toHaveAttribute("name", "searchTerm");
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Input Handling", () => {
    test("updates input value when typing", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      fireEvent.change(input, { target: { value: "test search" } });

      expect(input.value).toBe("test search");
    });

    test("handles empty input", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      expect(input.value).toBe("");
    });

    test("handles special characters in input", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const specialText = "!@#$%^&*()";
      fireEvent.change(input, { target: { value: specialText } });

      expect(input.value).toBe(specialText);
    });

    test("handles multiple rapid changes", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");

      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.change(input, { target: { value: "abc" } });

      expect(input.value).toBe("abc");
    });
  });

  describe("Form Submission", () => {
    test("calls searchFor with trimmed search term on form submit", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "  test search  " } });
      fireEvent.submit(form);

      expect(mockSearchFor).toHaveBeenCalledWith("test search");
      expect(mockSearchFor).toHaveBeenCalledTimes(1);
    });

    test("calls searchFor with undefined when search term is only spaces", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.submit(form);

      expect(mockSearchFor).toHaveBeenCalledWith(undefined);
    });

    test("calls searchFor with undefined when search term is empty", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const form = getSearchForm();
      fireEvent.submit(form);

      expect(mockSearchFor).toHaveBeenCalledWith(undefined);
    });

    test("trims and updates input value after submit", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "  test search  " } });
      fireEvent.submit(form);

      expect(input.value).toBe("test search");
    });

    test("handles submit via button click", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const button = screen.getByRole("button", { name: /submit/i });

      fireEvent.change(input, { target: { value: "button test" } });
      fireEvent.click(button);

      expect(mockSearchFor).toHaveBeenCalledWith("button test");
    });

    test("prevents default form submission behavior", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const form = getSearchForm();
      const mockPreventDefault = jest.fn();

      const event = new Event("submit", { bubbles: true, cancelable: true });
      event.preventDefault = mockPreventDefault;

      fireEvent(form, event);

      expect(mockPreventDefault).toHaveBeenCalled();
    });
  });

  describe("Props Handling", () => {
    test("handles missing searchFor prop gracefully", () => {
      // This should not crash the component
      expect(() => {
        render(<SearchForm />);
      }).not.toThrow();
    });

    test("calls different searchFor functions correctly", () => {
      const firstSearchFor = jest.fn();
      const secondSearchFor = jest.fn();

      const { rerender } = render(<SearchForm searchFor={firstSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "first search" } });
      fireEvent.submit(form);

      expect(firstSearchFor).toHaveBeenCalledWith("first search");
      expect(secondSearchFor).not.toHaveBeenCalled();

      rerender(<SearchForm searchFor={secondSearchFor} />);

      fireEvent.change(input, { target: { value: "second search" } });
      fireEvent.submit(form);

      expect(secondSearchFor).toHaveBeenCalledWith("second search");
      expect(firstSearchFor).toHaveBeenCalledTimes(1);
    });
  });

  describe("Debugging and Console Output", () => {
    test("logs debug information on render", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation();

      render(<SearchForm searchFor={mockSearchFor} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        "SearchForm",
        "searchFor=",
        "function"
      );

      consoleSpy.mockRestore();
    });

    test("logs correct type when searchFor is undefined", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation();

      render(<SearchForm searchFor={undefined} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        "SearchForm",
        "searchFor=",
        "undefined"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    test("form has proper semantic structure", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const form = screen.getByRole("form", { name: "search-form" });
      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button");

      expect(form).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    test("input is accessible via placeholder text", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      expect(input).toBeInTheDocument();
      expect(input).toBeVisible();
    });

    test("button has accessible text", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });

    test("supports keyboard navigation", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const button = screen.getByRole("button", { name: /submit/i });

      input.focus();
      expect(document.activeElement).toBe(input);

      fireEvent.keyDown(input, { key: "Tab" });
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test("supports form submission via Enter key", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");

      fireEvent.change(input, { target: { value: "keyboard test" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockSearchFor).toHaveBeenCalledWith("keyboard test");
    });
  });

  describe("Edge Cases", () => {
    test("handles very long search terms", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const longText = "a".repeat(1000);

      fireEvent.change(input, { target: { value: longText } });
      fireEvent.submit(getSearchForm());

      expect(mockSearchFor).toHaveBeenCalledWith(longText);
      expect(input.value).toBe(longText);
    });

    test("handles search terms with only whitespace characters", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const whitespaceChars = "\t\n\r ";

      fireEvent.change(input, { target: { value: whitespaceChars } });
      fireEvent.submit(getSearchForm());

      expect(mockSearchFor).toHaveBeenCalledWith(undefined);
    });

    test("handles multiple consecutive submissions", () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "test" } });

      fireEvent.submit(form);
      fireEvent.submit(form);
      fireEvent.submit(form);

      expect(mockSearchFor).toHaveBeenCalledTimes(3);
      expect(mockSearchFor).toHaveBeenCalledWith("test");
    });

    test("handles rapid input changes followed by submission", async () => {
      render(<SearchForm searchFor={mockSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      // Rapid changes
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `test${i}` } });
      }

      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockSearchFor).toHaveBeenCalledWith("test9");
      });
    });
  });

  describe("State Management", () => {
    test("maintains independent state across multiple instances", () => {
      const firstSearchFor = jest.fn();
      const secondSearchFor = jest.fn();

      const { container: firstContainer } = render(
        <SearchForm searchFor={firstSearchFor} />
      );
      const { container: secondContainer } = render(
        <SearchForm searchFor={secondSearchFor} />
      );

      const firstInput = firstContainer.querySelector(
        'input[name="searchTerm"]'
      );
      const secondInput = secondContainer.querySelector(
        'input[name="searchTerm"]'
      );

      fireEvent.change(firstInput, { target: { value: "first" } });
      fireEvent.change(secondInput, { target: { value: "second" } });

      expect(firstInput.value).toBe("first");
      expect(secondInput.value).toBe("second");
    });

    test("clears input state when component unmounts and remounts", () => {
      const { unmount } = render(<SearchForm searchFor={mockSearchFor} />);

      let input = screen.getByPlaceholderText("Enter search term..");
      fireEvent.change(input, { target: { value: "test" } });
      expect(input.value).toBe("test");

      unmount();

      render(<SearchForm searchFor={mockSearchFor} />);
      input = screen.getByPlaceholderText("Enter search term..");
      expect(input.value).toBe("");
    });
  });

  describe("Integration Scenarios", () => {
    test("works with async searchFor function", async () => {
      const asyncSearchFor = jest.fn().mockResolvedValue("success");

      render(<SearchForm searchFor={asyncSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "async test" } });
      fireEvent.submit(form);

      expect(asyncSearchFor).toHaveBeenCalledWith("async test");

      await waitFor(() => {
        expect(asyncSearchFor).toHaveReturned();
      });
    });

    test("handles searchFor function that throws error", () => {
      const errorSearchFor = jest.fn().mockImplementation(() => {
        throw new Error("Search failed");
      });

      render(<SearchForm searchFor={errorSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      const form = getSearchForm();

      fireEvent.change(input, { target: { value: "error test" } });

      // This should not crash the component
      expect(() => {
        fireEvent.submit(form);
      }).not.toThrow();

      expect(errorSearchFor).toHaveBeenCalledWith("error test");
    });

    test("maintains functionality after prop changes", () => {
      const firstSearchFor = jest.fn();
      const secondSearchFor = jest.fn();

      const { rerender } = render(<SearchForm searchFor={firstSearchFor} />);

      const input = screen.getByPlaceholderText("Enter search term..");
      fireEvent.change(input, { target: { value: "persistent value" } });

      rerender(<SearchForm searchFor={secondSearchFor} />);

      // Input value should persist
      expect(input.value).toBe("persistent value");

      // New function should be called
      fireEvent.submit(getSearchForm());
      expect(secondSearchFor).toHaveBeenCalledWith("persistent value");
      expect(firstSearchFor).not.toHaveBeenCalled();
    });
  });
});
