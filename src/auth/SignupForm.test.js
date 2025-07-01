import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SignupForm from "./SignupForm";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Alert component
jest.mock("../common/Alert", () => {
  return function MockAlert({ type, messages }) {
    return (
      <div data-testid="alert" className={`alert-${type}`}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    );
  };
});

describe("SignupForm Component", () => {
  const mockSignup = jest.fn();

  beforeEach(() => {
    // Clear mocks before each test
    mockSignup.mockClear();
    mockNavigate.mockClear();
  });

  const renderSignupForm = (signupProp = mockSignup) => {
    return render(
      <BrowserRouter>
        <SignupForm signup={signupProp} />
      </BrowserRouter>
    );
  };

  describe("Form Rendering", () => {
    test("renders all form fields and elements", () => {
      renderSignupForm();

      // Check for form title
      expect(screen.getByText("Sign Up")).toBeInTheDocument();

      // Check for all form fields by name attribute
      expect(screen.getAllByDisplayValue("")).toHaveLength(5); // All 5 inputs should be empty initially
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();

      // Check for specific input fields
      expect(
        screen.getByRole("textbox", { name: /username/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /first name/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /last name/i })
      ).toBeInTheDocument();

      // Password field (input type="password")
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    test("renders form fields with correct input types", () => {
      renderSignupForm();

      const passwordInput = document.querySelector('input[name="password"]');
      const emailInput = document.querySelector('input[name="email"]');
      const usernameInput = document.querySelector('input[name="username"]');

      expect(passwordInput).toHaveAttribute("type", "password");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(usernameInput).not.toHaveAttribute("type"); // defaults to text
    });

    test("initially shows empty form fields", () => {
      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      expect(usernameInput).toHaveValue("");
      expect(passwordInput).toHaveValue("");
      expect(firstNameInput).toHaveValue("");
      expect(lastNameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
    });
  });

  describe("User Input Handling", () => {
    test("allows user to type in username field", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      await user.type(usernameInput, "testuser");

      expect(usernameInput).toHaveValue("testuser");
    });

    test("allows user to type in password field", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const passwordInput = document.querySelector('input[name="password"]');
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    test("allows user to type in first name field", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const firstNameInput = document.querySelector('input[name="firstName"]');
      await user.type(firstNameInput, "John");

      expect(firstNameInput).toHaveValue("John");
    });

    test("allows user to type in last name field", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const lastNameInput = document.querySelector('input[name="lastName"]');
      await user.type(lastNameInput, "Doe");

      expect(lastNameInput).toHaveValue("Doe");
    });

    test("allows user to type in email field", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const emailInput = document.querySelector('input[name="email"]');
      await user.type(emailInput, "john.doe@example.com");

      expect(emailInput).toHaveValue("john.doe@example.com");
    });

    test("updates multiple fields independently", async () => {
      const user = userEvent.setup();
      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "john@example.com");

      expect(usernameInput).toHaveValue("testuser");
      expect(passwordInput).toHaveValue("password123");
      expect(firstNameInput).toHaveValue("John");
      expect(lastNameInput).toHaveValue("Doe");
      expect(emailInput).toHaveValue("john@example.com");
    });
  });

  describe("Form Submission", () => {
    test("calls signup function with form data on successful submission", async () => {
      const user = userEvent.setup();
      mockSignup.mockResolvedValue({ success: true });

      renderSignupForm();

      // Fill out the form
      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "john@example.com");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(mockSignup).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
    });

    test("navigates to /companies on successful signup", async () => {
      const user = userEvent.setup();
      mockSignup.mockResolvedValue({ success: true });

      renderSignupForm();

      // Fill out and submit form
      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "john@example.com");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/companies");
      });
    });

    test("can submit form by clicking submit button", async () => {
      const user = userEvent.setup();
      mockSignup.mockResolvedValue({ success: true });

      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "john@example.com");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(mockSignup).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("displays error messages when signup fails", async () => {
      const user = userEvent.setup();
      const errorMessages = ["Username already exists", "Invalid email format"];
      mockSignup.mockRejectedValue(errorMessages);

      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "existinguser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "invalid-email");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("alert")).toBeInTheDocument();
        expect(screen.getByText("Username already exists")).toBeInTheDocument();
        expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      });
    });

    test("does not navigate when signup fails", async () => {
      const user = userEvent.setup();
      mockSignup.mockRejectedValue(["Signup failed"]);

      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "john@example.com");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("alert")).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("submit button is accessible", () => {
      renderSignupForm();

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    test("form has proper structure", () => {
      renderSignupForm();

      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty form submission", async () => {
      const user = userEvent.setup();
      mockSignup.mockResolvedValue({ success: true });

      renderSignupForm();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(mockSignup).toHaveBeenCalledWith({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
      });
    });

    test("handles special characters in input fields", async () => {
      const user = userEvent.setup();
      mockSignup.mockResolvedValue({ success: true });

      renderSignupForm();

      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');
      const emailInput = document.querySelector('input[name="email"]');

      await user.type(usernameInput, "user@123");
      await user.type(passwordInput, "p@ssw0rd!");
      await user.type(firstNameInput, "José");
      await user.type(lastNameInput, "O'Connor");
      await user.type(emailInput, "test+email@example.com");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(mockSignup).toHaveBeenCalledWith({
        username: "user@123",
        password: "p@ssw0rd!",
        firstName: "José",
        lastName: "O'Connor",
        email: "test+email@example.com",
      });
    });
  });
});
