import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "./ProfileForm";
import SnacrisApi from "../../api/api";
import UserContext from "../../auth/UserContext";

// Mock the API
jest.mock("../../api/api", () => ({
  saveProfile: jest.fn(),
}));

// Mock the Alert component
jest.mock("../../common/Alert", () => {
  return function MockAlert({ type, messages }) {
    return (
      <div data-testid={`alert-${type}`} className={`alert-${type}`}>
        {messages.map((message, idx) => (
          <div key={idx} data-testid="alert-message">
            {message}
          </div>
        ))}
      </div>
    );
  };
});

describe("ProfileForm Component", () => {
  const mockCurrentUser = {
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    email: "test@user.com",
  };

  const mockSetCurrentUser = jest.fn();

  // Setup function to render component with context
  const renderWithContext = (user = mockCurrentUser) => {
    return render(
      <UserContext.Provider
        value={{ currentUser: user, setCurrentUser: mockSetCurrentUser }}
      >
        <ProfileForm />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with initial user data", () => {
    renderWithContext();

    // Check if form title is present
    expect(screen.getByText("My Profile")).toBeInTheDocument();

    // Check if form fields are populated with user data
    expect(
      screen.getByDisplayValue(mockCurrentUser.firstName)
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockCurrentUser.lastName)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCurrentUser.email)).toBeInTheDocument();

    // Username should be displayed but disabled
    const usernameInput = screen.getByLabelText("Username");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toBeDisabled();
  });

  test("handles input changes", async () => {
    renderWithContext();

    // Get form inputs
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");

    // Change input values
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "NewFirst");
    expect(firstNameInput).toHaveValue("NewFirst");

    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "NewLast");
    expect(lastNameInput).toHaveValue("NewLast");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "new@email.com");
    expect(emailInput).toHaveValue("new@email.com");
  });

  test("submits form successfully", async () => {
    const updatedUser = {
      ...mockCurrentUser,
      firstName: "UpdatedFirst",
      lastName: "UpdatedLast",
      email: "updated@email.com",
    };

    // Mock successful API response
    SnacrisApi.saveProfile.mockResolvedValue(updatedUser);

    renderWithContext();

    // Get form inputs
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByText("Save Changes");

    // Update form values
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, updatedUser.firstName);

    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, updatedUser.lastName);

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, updatedUser.email);

    // Submit form
    fireEvent.click(submitButton);

    // Check if API was called with correct data
    await waitFor(() => {
      expect(SnacrisApi.saveProfile).toHaveBeenCalledWith(
        mockCurrentUser.username,
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        }
      );
    });

    // Check for success message
    await waitFor(() => {
      expect(screen.getByTestId("alert-success")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Updated successfully."
      );
    });

    // Check if currentUser was updated
    await waitFor(() => {
      expect(mockSetCurrentUser).toHaveBeenCalled();
    });
  });

  test("handles API errors", async () => {
    // Mock API error
    const errorMessage = ["Invalid email format"];
    SnacrisApi.saveProfile.mockRejectedValue(errorMessage);

    renderWithContext();

    // Get form inputs
    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByText("Save Changes");

    // Update email with invalid value
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "invalid-email");

    // Submit form
    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
      expect(screen.getByTestId("alert-message")).toHaveTextContent(
        "Invalid email format"
      );
    });

    // Check that currentUser was not updated
    expect(mockSetCurrentUser).not.toHaveBeenCalled();
  });

  test("clears error messages when input changes", async () => {
    renderWithContext();

    // Mock initial error state
    const errorMessage = ["Test error"];
    SnacrisApi.saveProfile.mockRejectedValue(errorMessage);

    // Get form inputs
    const firstNameInput = screen.getByLabelText("First Name");
    const submitButton = screen.getByText("Save Changes");

    // Submit form to trigger error
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId("alert-danger")).toBeInTheDocument();
    });

    // Change input value
    await userEvent.type(firstNameInput, "New");

    // Check that error message is cleared
    expect(screen.queryByTestId("alert-danger")).not.toBeInTheDocument();
  });
});
