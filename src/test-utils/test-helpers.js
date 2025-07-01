import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../auth/UserContext";

// Helper function to render components with Router context
export const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Helper function to render components with UserContext
export const renderWithUserContext = (component, currentUser = null) => {
  const mockContextValue = {
    currentUser,
    setCurrentUser: jest.fn(),
  };

  return render(
    <BrowserRouter>
      <UserContext.Provider value={mockContextValue}>
        {component}
      </UserContext.Provider>
    </BrowserRouter>
  );
};

// Common test data
export const mockUsers = {
  validUser: {
    id: 1,
    username: "testuser",
    email: "test@example.com",
  },
  adminUser: {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    isAdmin: true,
  },
};

// Common mock functions
export const createMockApi = () => ({
  login: jest.fn(),
  signup: jest.fn(),
  getCurrentUser: jest.fn(),
  logout: jest.fn(),
});

// Helper to wait for async operations
export const waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      try {
        callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };

    check();
  });
};
