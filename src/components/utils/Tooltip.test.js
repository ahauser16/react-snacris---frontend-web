import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "./Tooltip";

// Mock IconContainer
jest.mock("../../assets/icons/IconContainer", () => {
  return function MockIconContainer({ name, label, iconClassName, iconSize }) {
    return (
      <span
        data-testid="mock-icon"
        className={iconClassName}
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        {label || name}
      </span>
    );
  };
});

// Mock Accordion
jest.mock("./Accordion", () => {
  return function MockAccordion({
    children,
    title,
    show,
    onClick,
    alertClass,
    id,
  }) {
    return (
      <div data-testid="mock-accordion" className={alertClass} id={id}>
        <button onClick={onClick} data-testid="accordion-title">
          {title}
        </button>
        {show && <div data-testid="accordion-content">{children}</div>}
      </div>
    );
  };
});

describe("Tooltip Component", () => {
  // Mock window.matchMedia for touch device detection
  const mockMatchMedia = (matches) => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };

  const setDeviceMode = async (isTouch) => {
    await act(async () => {
      // Mock matchMedia for (pointer: coarse)
      mockMatchMedia(isTouch);

      // Mock ontouchstart
      Object.defineProperty(window, "ontouchstart", {
        configurable: true,
        value: isTouch ? {} : undefined,
      });

      // Mock maxTouchPoints
      Object.defineProperty(navigator, "maxTouchPoints", {
        configurable: true,
        value: isTouch ? 1 : 0,
      });

      // Trigger resize to update useIsTouchDevice hook
      window.dispatchEvent(new Event("resize"));

      // Wait for state updates
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  beforeEach(async () => {
    // Reset mocks
    jest.resetModules();

    // Set up window.matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Reset touch-related properties
    Object.defineProperty(window, 'ontouchstart', {
      configurable: true,
      value: undefined,
    });

    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 0,
    });

    // Wait for any pending state updates
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  describe("Desktop Version (Non-touch device)", () => {
    beforeEach(async () => {
      await setDeviceMode(false);
    });

    test("renders with default props", async () => {
      const { container } = render(<Tooltip />);

      // Using container query since the button is styled without role
      const tooltipButton = container.querySelector(".btn.btn-link");
      expect(tooltipButton).toBeInTheDocument();
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    test("shows tooltip on mouse enter and hides on mouse leave", async () => {
      const helperText = "This is a helpful message";
      const { container } = render(<Tooltip helperText={helperText} />);

      const tooltipButton = container.querySelector(".btn.btn-link");

      // Show tooltip
      fireEvent.mouseEnter(tooltipButton);
      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(helperText);

      // Hide tooltip
      fireEvent.mouseLeave(tooltipButton);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    test("shows tooltip on focus and hides on blur", async () => {
      const helperText = "Focus tooltip";
      const { container } = render(<Tooltip helperText={helperText} />);

      const tooltipButton = container.querySelector(".btn.btn-link");

      // Show on focus
      fireEvent.focus(tooltipButton);
      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(helperText);

      // Hide on blur
      fireEvent.blur(tooltipButton);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    test("applies custom styles and properties correctly", async () => {
      const props = {
        iconName: "custom-icon",
        label: "Custom Label",
        iconClassName: "custom-class me-2",
        iconSize: 48,
        helperText: "Custom helper text",
      };

      const { container } = render(<Tooltip {...props} />);

      // Check icon properties
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveClass(props.iconClassName);
      expect(icon).toHaveStyle({
        width: `${props.iconSize}px`,
        height: `${props.iconSize}px`,
      });
      expect(icon).toHaveTextContent(props.label);

      // Check button styles
      const tooltipButton = container.querySelector(".btn.btn-link");
      expect(tooltipButton).toHaveStyle({
        outline: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
      });

      // Check tooltip content
      fireEvent.mouseEnter(tooltipButton);
      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip).toHaveTextContent(props.helperText);
      expect(tooltip).toHaveStyle({
        position: "absolute",
        zIndex: "1000",
        minWidth: "200px",
      });
    });
  });

  describe("Mobile Version (Touch device)", () => {
    beforeEach(async () => {
      await setDeviceMode(true);
    });

    test("renders accordion with correct properties", async () => {
      const props = {
        iconName: "mobile-icon",
        label: "Mobile Label",
        helperText: "Mobile helper text",
        accordionTitle: "Custom Mobile Title",
        alertClass: "alert-warning",
      };

      render(<Tooltip {...props} />);

      const accordion = screen.getByTestId("mock-accordion");
      expect(accordion).toBeInTheDocument();
      expect(accordion).toHaveClass(props.alertClass);
      expect(accordion).toHaveAttribute("id", "tooltip-helper");

      // Check title with icon
      const title = screen.getByTestId("accordion-title");
      expect(title).toHaveTextContent(props.accordionTitle);
      const icon = screen.getByTestId("mock-icon");
      expect(icon).toHaveTextContent(props.label);

      // Toggle accordion
      fireEvent.click(title);
      const content = await screen.findByTestId("accordion-content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent(props.helperText);

      // Hide content
      fireEvent.click(title);
      expect(screen.queryByTestId("accordion-content")).not.toBeInTheDocument();
    });
  });

  describe("Device Detection and Responsive Behavior", () => {
    test("switches between desktop and mobile versions on device change", async () => {
      const props = {
        helperText: "Responsive test",
        label: "Test Label",
      };

      const { container, rerender } = render(<Tooltip {...props} />);

      // Initially desktop
      await setDeviceMode(false);
      rerender(<Tooltip {...props} />);

      const tooltipButton = container.querySelector(".btn.btn-link");
      expect(tooltipButton).toBeInTheDocument();
      expect(screen.queryByTestId("mock-accordion")).not.toBeInTheDocument();

      // Switch to mobile
      await setDeviceMode(true);
      rerender(<Tooltip {...props} />);

      expect(container.querySelector(".btn.btn-link")).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();

      // Switch back to desktop
      await setDeviceMode(false);
      rerender(<Tooltip {...props} />);

      expect(container.querySelector(".btn.btn-link")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-accordion")).not.toBeInTheDocument();
    });

    test("handles edge cases in device detection", async () => {
      const { container, rerender } = render(
        <Tooltip helperText="Edge case test" />
      );

      // Test with only maxTouchPoints support
      await act(async () => {
        mockMatchMedia(false);
        Object.defineProperty(window, "ontouchstart", {
          configurable: true,
          value: undefined,
        });
        Object.defineProperty(navigator, "maxTouchPoints", {
          configurable: true,
          value: 1,
        });
        window.dispatchEvent(new Event("resize"));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      rerender(<Tooltip helperText="Edge case test" />);

      // Should be in mobile mode due to maxTouchPoints
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();

      // Test with only pointer: coarse media query match
      await act(async () => {
        mockMatchMedia(true);
        Object.defineProperty(window, "ontouchstart", {
          configurable: true,
          value: undefined,
        });
        Object.defineProperty(navigator, "maxTouchPoints", {
          configurable: true,
          value: 0,
        });
        window.dispatchEvent(new Event("resize"));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      rerender(<Tooltip helperText="Edge case test" />);

      // Should still be in mobile mode due to media query
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();

      // Test with only ontouchstart
      await act(async () => {
        mockMatchMedia(false);
        Object.defineProperty(window, "ontouchstart", {
          configurable: true,
          value: {},
        });
        Object.defineProperty(navigator, "maxTouchPoints", {
          configurable: true,
          value: 0,
        });
        window.dispatchEvent(new Event("resize"));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      rerender(<Tooltip helperText="Edge case test" />);

      // Should be in mobile mode due to ontouchstart
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();
    });
  });
});
