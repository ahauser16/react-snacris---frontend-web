import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  test("renders loading spinner with correct text", () => {
    render(<LoadingSpinner />);

    // Check that the loading text is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with correct CSS class", () => {
    render(<LoadingSpinner />);

    // Check that the component has the correct CSS class
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveClass("LoadingSpinner");
  });

  test("has correct data-testid attribute", () => {
    render(<LoadingSpinner />);

    // Verify the data-testid is present
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  test("renders as a div element", () => {
    render(<LoadingSpinner />);

    // Check that it's rendered as a div
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner.tagName).toBe("DIV");
  });

  test("accessibility - has appropriate loading indication", () => {
    render(<LoadingSpinner />);

    // Check that screen readers can identify loading content
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveTextContent("Loading...");

    // Verify it's accessible by text content
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("can be found by role (generic)", () => {
    render(<LoadingSpinner />);

    // Since it's a div, it should have generic role
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  test("snapshot test - component structure remains consistent", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("multiple instances can be rendered", () => {
    render(
      <div>
        <LoadingSpinner />
        <LoadingSpinner />
      </div>
    );

    // Both instances should be present
    const spinners = screen.getAllByTestId("loading-spinner");
    expect(spinners).toHaveLength(2);

    // Both should have the loading text
    const loadingTexts = screen.getAllByText("Loading...");
    expect(loadingTexts).toHaveLength(2);
  });

  test("component is pure - no props needed", () => {
    // Should render without any props
    expect(() => render(<LoadingSpinner />)).not.toThrow();

    // Should render the same output every time
    const { container: firstContainer } = render(<LoadingSpinner />);
    const firstRender = firstContainer.textContent;

    const { container: secondContainer } = render(<LoadingSpinner />);
    const secondRender = secondContainer.textContent;

    expect(firstRender).toBe(secondRender);
    expect(firstRender).toBe("Loading...");
  });

  test("integrates well with parent components", () => {
    const ParentComponent = () => (
      <div data-testid="parent">
        <h1>Data Loading</h1>
        <LoadingSpinner />
      </div>
    );

    render(<ParentComponent />);

    // Parent should contain the spinner
    const parent = screen.getByTestId("parent");
    const spinner = screen.getByTestId("loading-spinner");

    expect(parent).toContainElement(spinner);
    expect(screen.getByText("Data Loading")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
