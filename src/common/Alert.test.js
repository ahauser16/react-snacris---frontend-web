import React from "react";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  beforeEach(() => {
    // Clear console debug calls before each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders with default props", () => {
      render(<Alert />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass("alert", "alert-danger");
    });

    test("renders with custom type", () => {
      render(<Alert type="success" />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert", "alert-success");
    });

    test("renders with warning type", () => {
      render(<Alert type="warning" />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert", "alert-warning");
    });

    test("renders with info type", () => {
      render(<Alert type="info" />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert", "alert-info");
    });

    test("renders with primary type", () => {
      render(<Alert type="primary" />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert", "alert-primary");
    });
  });

  describe("Message Display", () => {
    test("renders single message", () => {
      const messages = ["This is an error message"];
      render(<Alert messages={messages} />);

      expect(screen.getByText("This is an error message")).toBeInTheDocument();

      // Check that the message is in a paragraph with correct classes
      const messageElement = screen.getByText("This is an error message");
      expect(messageElement.tagName).toBe("P");
      expect(messageElement).toHaveClass("mb-0", "medium");
    });

    test("renders multiple messages", () => {
      const messages = [
        "First error message",
        "Second error message",
        "Third error message",
      ];
      render(<Alert messages={messages} />);

      expect(screen.getByText("First error message")).toBeInTheDocument();
      expect(screen.getByText("Second error message")).toBeInTheDocument();
      expect(screen.getByText("Third error message")).toBeInTheDocument();

      // Check that all messages are rendered as separate paragraphs
      const paragraphs = screen.getAllByText(/error message/);
      expect(paragraphs).toHaveLength(3);

      paragraphs.forEach((p) => {
        expect(p.tagName).toBe("P");
        expect(p).toHaveClass("mb-0", "medium");
      });
    });

    test("renders with empty messages array", () => {
      render(<Alert messages={[]} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toBeEmptyDOMElement();
    });

    test("handles long messages", () => {
      const longMessage =
        "This is a very long error message that should still be displayed properly even though it contains a lot of text and might wrap to multiple lines in the UI";
      render(<Alert messages={[longMessage]} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    test("handles special characters in messages", () => {
      const specialMessages = [
        "Error with special chars: @#$%^&*()",
        "Error with quotes: 'single' and \"double\"",
        "Error with unicode: café naïve résumé",
      ];
      render(<Alert messages={specialMessages} />);

      specialMessages.forEach((message) => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });

  describe("Props Handling", () => {
    test("uses danger as default type when no type provided", () => {
      render(<Alert messages={["Test message"]} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert-danger");
    });

    test("uses empty array as default when no messages provided", () => {
      render(<Alert type="success" />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeEmptyDOMElement();
      expect(alertElement).toHaveClass("alert-success");
    });

    test("accepts both type and messages props", () => {
      const messages = ["Success message"];
      render(<Alert type="success" messages={messages} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert-success");
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });
  });

  describe("Bootstrap Integration", () => {
    test("applies correct Bootstrap alert classes", () => {
      render(<Alert type="warning" messages={["Warning message"]} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toHaveClass("alert");
      expect(alertElement).toHaveClass("alert-warning");
    });

    test("applies correct paragraph classes for Bootstrap styling", () => {
      render(<Alert messages={["Styled message"]} />);

      const messageElement = screen.getByText("Styled message");
      expect(messageElement).toHaveClass("mb-0"); // Bootstrap margin class
      expect(messageElement).toHaveClass("medium"); // Custom text size class
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA role", () => {
      render(<Alert messages={["Accessible message"]} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
    });

    test("alert role is present for screen readers", () => {
      render(<Alert type="danger" messages={["Error for screen reader"]} />);

      // The alert role should make this announcement to screen readers
      const alertElement = screen.getByRole("alert");
      expect(alertElement.getAttribute("role")).toBe("alert");
    });
  });

  describe("Console Debug", () => {
    test("logs debug information", () => {
      const consoleSpy = jest
        .spyOn(console, "debug")
        .mockImplementation(() => {});

      const messages = ["Debug test message"];
      render(<Alert type="info" messages={messages} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Alert",
        "type=",
        "info",
        "messages=",
        messages
      );

      consoleSpy.mockRestore();
    });

    test("logs with default props", () => {
      const consoleSpy = jest
        .spyOn(console, "debug")
        .mockImplementation(() => {});

      render(<Alert />);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Alert",
        "type=",
        "danger",
        "messages=",
        []
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    test("handles null messages gracefully", () => {
      // With the improved Alert component, null messages should be handled gracefully
      render(<Alert messages={null} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toBeEmptyDOMElement();
    });

    test("handles undefined messages gracefully", () => {
      render(<Alert messages={undefined} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
    });

    test("handles messages with duplicates", () => {
      // With the improved key strategy (using index), duplicate messages
      // no longer create React key warnings
      const duplicateMessages = [
        "Duplicate message",
        "Duplicate message",
        "Unique message",
      ];

      render(<Alert messages={duplicateMessages} />);

      // Should render all messages even if duplicated
      const paragraphs = screen.getAllByText(/message/);
      expect(paragraphs).toHaveLength(3);
    });

    test("handles empty string messages", () => {
      const messages = ["", "Valid message", ""];

      // Suppress console.error for this test since we expect the React key warning
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Alert messages={messages} />);

      expect(screen.getByText("Valid message")).toBeInTheDocument();

      // Check that empty messages still create paragraph elements
      const allParagraphs = document.querySelectorAll("p.mb-0.medium");
      expect(allParagraphs).toHaveLength(3);

      consoleSpy.mockRestore();
    });
  });

  describe("Component Integration", () => {
    test("can be used for form validation errors", () => {
      const formErrors = [
        "Username is required",
        "Password must be at least 8 characters",
        "Email format is invalid",
      ];
      render(<Alert type="danger" messages={formErrors} />);

      formErrors.forEach((error) => {
        expect(screen.getByText(error)).toBeInTheDocument();
      });

      expect(screen.getByRole("alert")).toHaveClass("alert-danger");
    });

    test("can be used for success notifications", () => {
      const successMessages = ["Profile updated successfully!"];
      render(<Alert type="success" messages={successMessages} />);

      expect(
        screen.getByText("Profile updated successfully!")
      ).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveClass("alert-success");
    });

    test("can be used for informational messages", () => {
      const infoMessages = ["Please verify your email address"];
      render(<Alert type="info" messages={infoMessages} />);

      expect(
        screen.getByText("Please verify your email address")
      ).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveClass("alert-info");
    });
  });
});
