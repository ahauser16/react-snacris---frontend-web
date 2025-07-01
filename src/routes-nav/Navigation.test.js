import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "./Navigation";
import { renderWithUserContext } from "../test-utils/test-helpers";
import { mockUsers } from "../test-utils/test-helpers";

describe("Navigation Component", () => {
  const mockLogout = jest.fn();

  test("renders navigation bar with brand link", () => {
    renderWithUserContext(<Navigation logout={mockLogout} />);
    const brandLink = screen.getByText("SNACRIS");
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.tagName).toBe("A");
    expect(brandLink).toHaveAttribute("href", "/");
  });

  test("renders login and signup links when user is logged out", () => {
    renderWithUserContext(<Navigation logout={mockLogout} />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();

    // Verify that logged-in nav links are not present
    expect(
      screen.queryByText("Address & Parcel Lookup")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
  });

  test("renders appropriate navigation links when user is logged in", () => {
    renderWithUserContext(
      <Navigation logout={mockLogout} />,
      mockUsers.validUser
    );

    // Check that authenticated user links are present
    expect(screen.getByText("Address & Parcel Lookup")).toBeInTheDocument();
    expect(screen.getByText("Party Name")).toBeInTheDocument();
    expect(screen.getByText("Search By Parcel")).toBeInTheDocument();
    expect(screen.getByText("Document Type")).toBeInTheDocument();
    expect(screen.getByText("Doc ID & CRFN")).toBeInTheDocument();
    expect(screen.getByText("Transaction Number")).toBeInTheDocument();
    expect(screen.getByText("Reel & Page")).toBeInTheDocument();
    expect(
      screen.getByText("UCC & Federal Lien File Number")
    ).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();

    // Check that the logout link shows username
    expect(screen.getByText(/Log out testuser/)).toBeInTheDocument();

    // Verify that logged-out nav links are not present
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  test("shows first name in logout link if available", () => {
    const userWithFirstName = {
      ...mockUsers.validUser,
      first_name: "Test",
    };

    renderWithUserContext(
      <Navigation logout={mockLogout} />,
      userWithFirstName
    );

    expect(screen.getByText(/Log out Test/)).toBeInTheDocument();
  });

  test("calls logout function when logout link is clicked", async () => {
    const user = userEvent.setup();
    renderWithUserContext(
      <Navigation logout={mockLogout} />,
      mockUsers.validUser
    );

    const logoutLink = screen.getByText(/Log out testuser/);
    await user.click(logoutLink);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
