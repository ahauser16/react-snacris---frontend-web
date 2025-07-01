import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App, { TOKEN_STORAGE_ID } from "./App";
import SnacrisApi from "./api/api";
import jwtDecode from "jwt-decode";

// Mock dependencies
jest.mock("./api/api");
jest.mock("jwt-decode");
jest.mock("./hooks/useLocalStorage");

// Mock components to focus on App logic
jest.mock("./routes-nav/Navigation", () => {
  return function MockNavigation({ logout }) {
    return (
      <nav data-testid="navigation">
        <button onClick={logout} data-testid="logout-btn">
          Logout
        </button>
      </nav>
    );
  };
});

jest.mock("./routes-nav/RoutesList", () => {
  return function MockRoutesList({ currentUser, login, signup }) {
    return (
      <div data-testid="routes-list">
        <div data-testid="current-user">
          {currentUser ? `User: ${currentUser.username}` : "Not logged in"}
        </div>
        <button
          onClick={() => login({ username: "testuser", password: "password" })}
          data-testid="login-btn"
        >
          Login
        </button>
        <button
          onClick={() => signup({ username: "newuser", password: "password" })}
          data-testid="signup-btn"
        >
          Signup
        </button>
      </div>
    );
  };
});

jest.mock("./common/LoadingSpinner", () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock useLocalStorage hook
const mockUseLocalStorage = require("./hooks/useLocalStorage");

describe("App Component", () => {
  let mockSetToken;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock for useLocalStorage
    mockSetToken = jest.fn();
    mockUseLocalStorage.default.mockReturnValue([null, mockSetToken]);

    // Setup default API mocks
    SnacrisApi.getCurrentUser = jest.fn();
    SnacrisApi.login = jest.fn();
    SnacrisApi.signup = jest.fn();

    // Setup JWT decode mock
    jwtDecode.mockClear();
  });

  // Helper function to render App within Router context
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  describe("Initial Rendering and Loading State", () => {
    test("should show loading spinner when user info is not loaded", async () => {
      // Create a promise that won't resolve immediately to simulate loading state
      let resolveGetCurrentUser;
      const getCurrentUserPromise = new Promise((resolve) => {
        resolveGetCurrentUser = resolve;
      });

      // Mock with token to trigger API call
      mockUseLocalStorage.default.mockReturnValue([
        "valid.jwt.token",
        mockSetToken,
      ]);
      jwtDecode.mockReturnValue({ username: "testuser" });
      SnacrisApi.getCurrentUser.mockReturnValue(getCurrentUserPromise);

      renderApp();

      // Should show loading spinner initially
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      // Resolve the promise to finish loading
      act(() => {
        resolveGetCurrentUser({ username: "testuser", id: 1 });
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });
    });

    test("should render navigation and routes when user info is loaded with no user", async () => {
      // Mock no token scenario
      mockUseLocalStorage.default.mockReturnValue([null, mockSetToken]);

      renderApp();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("navigation")).toBeInTheDocument();
      expect(screen.getByTestId("routes-list")).toBeInTheDocument();
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });
  });

  describe("Authentication Token Handling", () => {
    test("should load user info when valid token exists", async () => {
      const mockToken = "valid.jwt.token";
      const mockUser = { username: "testuser", id: 1 };

      // Mock token in localStorage
      mockUseLocalStorage.default.mockReturnValue([mockToken, mockSetToken]);

      // Mock JWT decode
      jwtDecode.mockReturnValue({ username: "testuser" });

      // Mock successful API call
      SnacrisApi.getCurrentUser.mockResolvedValue(mockUser);

      renderApp();

      // Wait for user info to load
      await waitFor(() => {
        expect(screen.getByText("User: testuser")).toBeInTheDocument();
      });

      // Verify API calls
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
      expect(SnacrisApi.getCurrentUser).toHaveBeenCalledWith("testuser");
      expect(SnacrisApi.token).toBe(mockToken);
    });

    test("should handle invalid token gracefully", async () => {
      const mockToken = "invalid.jwt.token";

      mockUseLocalStorage.default.mockReturnValue([mockToken, mockSetToken]);
      jwtDecode.mockReturnValue({ username: "testuser" });

      // Mock API error
      SnacrisApi.getCurrentUser.mockRejectedValue(new Error("Invalid token"));

      renderApp();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      expect(SnacrisApi.getCurrentUser).toHaveBeenCalledWith("testuser");
    });

    test("should handle JWT decode errors", async () => {
      const mockToken = "malformed.token";

      mockUseLocalStorage.default.mockReturnValue([mockToken, mockSetToken]);
      jwtDecode.mockImplementation(() => {
        throw new Error("Invalid token format");
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });
  });

  describe("Authentication Actions", () => {
    test("should handle successful login", async () => {
      const mockToken = "new.login.token";
      SnacrisApi.login.mockResolvedValue(mockToken);

      renderApp();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("login-btn")).toBeInTheDocument();
      });

      // Trigger login
      await act(async () => {
        screen.getByTestId("login-btn").click();
      });

      await waitFor(() => {
        expect(SnacrisApi.login).toHaveBeenCalledWith({
          username: "testuser",
          password: "password",
        });
        expect(mockSetToken).toHaveBeenCalledWith(mockToken);
      });
    });

    test("should handle successful signup", async () => {
      const mockToken = "new.signup.token";
      SnacrisApi.signup.mockResolvedValue(mockToken);

      renderApp();

      await waitFor(() => {
        expect(screen.getByTestId("signup-btn")).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByTestId("signup-btn").click();
      });

      await waitFor(() => {
        expect(SnacrisApi.signup).toHaveBeenCalledWith({
          username: "newuser",
          password: "password",
        });
        expect(mockSetToken).toHaveBeenCalledWith(mockToken);
      });
    });

    test("should handle logout", async () => {
      // Start with a logged-in user
      const mockToken = "existing.token";
      const mockUser = { username: "testuser", id: 1 };

      mockUseLocalStorage.default.mockReturnValue([mockToken, mockSetToken]);
      jwtDecode.default.mockReturnValue({ username: "testuser" });
      SnacrisApi.getCurrentUser.mockResolvedValue(mockUser);

      renderApp();

      // Wait for user to be loaded
      await waitFor(() => {
        expect(screen.getByText("User: testuser")).toBeInTheDocument();
      });

      // Trigger logout
      await act(async () => {
        screen.getByTestId("logout-btn").click();
      });

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalledWith(null);
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });
  });

  describe("User Context", () => {
    test("should provide user context to child components", async () => {
      const mockToken = "valid.token";
      const mockUser = { username: "contextuser", id: 1 };

      mockUseLocalStorage.default.mockReturnValue([mockToken, mockSetToken]);
      jwtDecode.mockReturnValue({ username: "contextuser" });
      SnacrisApi.getCurrentUser.mockResolvedValue(mockUser);

      renderApp();

      await waitFor(() => {
        expect(screen.getByText("User: contextuser")).toBeInTheDocument();
      });
    });

    test("should provide null user context when not logged in", async () => {
      mockUseLocalStorage.default.mockReturnValue([null, mockSetToken]);

      renderApp();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });
  });

  describe("Component Structure", () => {
    test("should render with correct structure when loaded", async () => {
      mockUseLocalStorage.default.mockReturnValue([null, mockSetToken]);

      renderApp();

      await waitFor(() => {
        const app = screen.getByTestId("navigation").closest(".App");
        expect(app).toBeInTheDocument();
        expect(screen.getByTestId("navigation")).toBeInTheDocument();
        expect(screen.getByTestId("routes-list")).toBeInTheDocument();
      });
    });

    test("should pass correct props to child components", async () => {
      mockUseLocalStorage.default.mockReturnValue([null, mockSetToken]);

      renderApp();

      await waitFor(() => {
        // Navigation should have logout prop (verified by presence of logout button)
        expect(screen.getByTestId("logout-btn")).toBeInTheDocument();

        // RoutesList should have currentUser, login, signup props (verified by rendered content)
        expect(screen.getByTestId("login-btn")).toBeInTheDocument();
        expect(screen.getByTestId("signup-btn")).toBeInTheDocument();
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });
  });
});
