import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutesList from "./RoutesList";
import { renderWithUserContext } from "../test-utils/test-helpers";
import { mockUsers } from "../test-utils/test-helpers";
import { MemoryRouter } from "react-router-dom";

// Mock the components rendered by RoutesList
jest.mock("../homepage/Homepage", () => () => (
  <div data-testid="homepage">Homepage</div>
));
jest.mock("../auth/LoginForm", () => ({ login }) => (
  <div data-testid="login-form">Login Form</div>
));
jest.mock("../auth/SignupForm", () => ({ signup }) => (
  <div data-testid="signup-form">Signup Form</div>
));
jest.mock("../pages/addressParcelLookup/AddressParcelLookup", () => () => (
  <div data-testid="address-parcel-lookup">Address Parcel Lookup</div>
));
jest.mock("../pages/partyName/PartyNameSearch", () => () => (
  <div data-testid="party-name-search">Party Name Search</div>
));
jest.mock("../pages/parcelIdentifier/ParcelIdentifierSearch", () => () => (
  <div data-testid="parcel-identifier-search">Parcel Identifier Search</div>
));
jest.mock("../pages/documentType/DocumentTypeSearch", () => () => (
  <div data-testid="document-type-search">Document Type Search</div>
));
jest.mock("../pages/documentIdCrfn/DocumentIdCrfnSearch", () => () => (
  <div data-testid="document-id-crfn-search">Document ID CRFN Search</div>
));
jest.mock("../pages/transactionNumber/TransactionNumberSearch", () => () => (
  <div data-testid="transaction-number-search">Transaction Number Search</div>
));
jest.mock("../pages/reelPage/ReelPageSearch", () => () => (
  <div data-testid="reel-page-search">Reel Page Search</div>
));
jest.mock(
  "../pages/uccFedLienFileNumber/UccFedLienFileNumberSearch",
  () => () =>
    (
      <div data-testid="ucc-fed-lien-file-number-search">
        UCC Fed Lien File Number Search
      </div>
    )
);
jest.mock("../pages/favorites/FavoritesPage", () => () => (
  <div data-testid="favorites-page">Favorites Page</div>
));
jest.mock("../pages/userProfile/ProfilePage", () => () => (
  <div data-testid="profile-page">Profile Page</div>
));

describe("RoutesList Component", () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();

  test("renders homepage for all users", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <RoutesList login={mockLogin} signup={mockSignup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  test("renders login and signup forms for non-authenticated users", () => {
    // Test login route
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <RoutesList login={mockLogin} signup={mockSignup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    // Cleanup and test signup route
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <RoutesList login={mockLogin} signup={mockSignup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  test("redirects to homepage for non-existent routes", () => {
    render(
      <MemoryRouter initialEntries={["/non-existent-route"]}>
        <RoutesList login={mockLogin} signup={mockSignup} />
      </MemoryRouter>
    );

    // In React Router v6, Navigate will automatically redirect, and the homepage component should be rendered
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });

  test("renders protected routes for authenticated users", () => {
    // Test the Address & Parcel Lookup route for authenticated users
    render(
      <MemoryRouter initialEntries={["/addressParcelLookup"]}>
        <RoutesList
          login={mockLogin}
          signup={mockSignup}
          currentUser={mockUsers.validUser}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("address-parcel-lookup")).toBeInTheDocument();

    // Test the Party Name Search route
    render(
      <MemoryRouter initialEntries={["/partyNameSearch"]}>
        <RoutesList
          login={mockLogin}
          signup={mockSignup}
          currentUser={mockUsers.validUser}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("party-name-search")).toBeInTheDocument();

    // Test the Profile route
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <RoutesList
          login={mockLogin}
          signup={mockSignup}
          currentUser={mockUsers.validUser}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("profile-page")).toBeInTheDocument();
  });

  test("does not render protected routes for non-authenticated users", () => {
    // Try to access a protected route (addressParcelLookup) without authentication
    render(
      <MemoryRouter initialEntries={["/addressParcelLookup"]}>
        <RoutesList login={mockLogin} signup={mockSignup} />
      </MemoryRouter>
    );

    // The protected component should not be rendered
    expect(
      screen.queryByTestId("address-parcel-lookup")
    ).not.toBeInTheDocument();

    // We should see the homepage instead (default redirect)
    expect(screen.getByTestId("homepage")).toBeInTheDocument();
  });
});
