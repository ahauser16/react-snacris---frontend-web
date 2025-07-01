import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Simple mock for useLocalStorage
jest.mock("./hooks/useLocalStorage");

// Mock API
jest.mock("./api/api", () => ({
  __esModule: true,
  default: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
    token: null,
  },
}));

// Mock jwt-decode
jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseLocalStorage = require("./hooks/useLocalStorage");

// Basic smoke test
test("App renders without crashing", () => {
  // Setup the mock to return [null, jest.fn()]
  mockUseLocalStorage.default.mockReturnValue([null, jest.fn()]);

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Should show the homepage for non-logged-in users
  expect(screen.getByRole("heading", { name: /SNACRIS/ })).toBeInTheDocument();
  expect(
    screen.getByText(/All NYC property records in one, convenient place/)
  ).toBeInTheDocument();
});
