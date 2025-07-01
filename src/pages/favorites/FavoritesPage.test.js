import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FavoritesPage from "./FavoritesPage";

// Mock the RetrieveDisplayRealPropertyDoc component
jest.mock(
  "../../components/acris/userFavorites/RetrieveDisplayRealPropertyDoc",
  () => {
    return function MockRetrieveDisplayRealPropertyDoc() {
      return (
        <div data-testid="retrieve-display-real-property-doc">
          Mocked Property Document Component
        </div>
      );
    };
  }
);

describe("FavoritesPage Component", () => {
  test("renders with RetrieveDisplayRealPropertyDoc component", () => {
    render(<FavoritesPage />);

    // Check if the page container renders with the correct class
    expect(
      screen
        .getByText("Mocked Property Document Component")
        .closest(".FavoritesPage")
    ).toBeInTheDocument();

    // Check if the mocked RetrieveDisplayRealPropertyDoc component is rendered
    expect(
      screen.getByTestId("retrieve-display-real-property-doc")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Property Document Component")
    ).toBeInTheDocument();
  });
});
