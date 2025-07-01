import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginForm Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Clear mocks before each test
    mockLogin.mockClear();
    mockNavigate.mockClear();
  });

  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm login={mockLogin} />
      </BrowserRouter>
    );
  };

  test("renders login form elements", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("allows user to enter username and password", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  test("calls login function on form submission", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true });

    renderLoginForm();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    });
  });

  test("displays error message on login failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(["Invalid credentials"]);

    renderLoginForm();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
