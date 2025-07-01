import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "./ProfilePage";

// Mock child components
jest.mock("./ProfileForm", () => {
  return function MockProfileForm() {
    return <div data-testid="mock-profile-form">Profile Form</div>;
  };
});

jest.mock("../../components/organization/MyOrganizations", () => {
  return function MockMyOrganizations() {
    return <div data-testid="mock-my-organizations">My Organizations</div>;
  };
});

describe("ProfilePage Component", () => {
  // Test for initial component rendering
  test("renders ProfilePage with all child components", () => {
    render(<ProfilePage />);

    // Check if the container is present with correct classes
    const container = screen.getByRole("main", { name: "profile" });
    expect(container).toHaveClass("ProfilePage", "container");

    // Check if child components are rendered
    expect(screen.getByTestId("mock-profile-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-my-organizations")).toBeInTheDocument();

    // Verify the text content of mock components
    expect(screen.getByText("Profile Form")).toBeInTheDocument();
    expect(screen.getByText("My Organizations")).toBeInTheDocument();
  });

  // Test for component order
  test("renders components in correct order", () => {
    render(<ProfilePage />);

    const profileForm = screen.getByTestId("mock-profile-form");
    const myOrganizations = screen.getByTestId("mock-my-organizations");

    // Check if ProfileForm appears before MyOrganizations in the DOM
    expect(profileForm.compareDocumentPosition(myOrganizations)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
});
