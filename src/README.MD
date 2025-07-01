# SRC / NOTES

## Testing

### 🎯 Jest Testing Guide for React

Jest is a JavaScript testing framework that comes pre-configured with Create React App. This guide will help test SNACRIS React components.

#### 🛠️ Current Setup

This project has Jest properly configured with:

✅ **Dependencies:**

- `@testing-library/react` - For testing React components
- `@testing-library/jest-dom` - Additional matchers for Jest
- `@testing-library/user-event` - For simulating user interactions

✅ **Configuration:**

- `jest.config.js` - Jest configuration
- `setupTests.js` - Test setup (loads jest-dom matchers)

#### 🏃‍♂️ Running Tests

```bash
# Run all tests once
npm run test:once

# Run tests in watch mode (recommended for development)
npm test

# Run a specific test file
npm test LoginForm.test.js

# Run tests with coverage report
npm run test:coverage

# Run tests matching a pattern
npm test -- --testNamePattern="login"
```

#### 📝 Basic Test Structure

```javascript
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

#### 🧪 Common Testing Patterns

**1. Testing Component Rendering**

```javascript
test("renders login form", () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
```

**2. Testing User Interactions**

```javascript
import userEvent from "@testing-library/user-event";

test("allows user to type in input", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  const input = screen.getByLabelText(/username/i);
  await user.type(input, "testuser");

  expect(input).toHaveValue("testuser");
});
```

**3. Testing Function Calls**

```javascript
test("calls onSubmit when form is submitted", async () => {
  const mockSubmit = jest.fn();
  const user = userEvent.setup();

  render(<LoginForm onSubmit={mockSubmit} />);

  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(mockSubmit).toHaveBeenCalled();
});
```

**4. Mocking External Dependencies**

```javascript
// Mock an API module
jest.mock("./api/api", () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock React Router hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
```

#### 🔍 Common Jest Matchers

```javascript
// Basic matchers
expect(value).toBe(4); // Exact equality
expect(value).toEqual({ name: "John" }); // Deep equality
expect(value).toBeTruthy(); // Truthy value
expect(value).toBeFalsy(); // Falsy value

// String matchers
expect("hello world").toMatch(/world/);
expect("hello world").toContain("world");

// Array matchers
expect(["apple", "banana"]).toContain("apple");
expect(array).toHaveLength(3);

// DOM matchers (from jest-dom)
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent("Hello");
expect(input).toHaveValue("test");
expect(button).toBeDisabled();
```

#### 🎯 Testing Best Practices

1. **Test Behavior, Not Implementation**

   - ❌ Bad: Testing internal state
   - ✅ Good: Testing what the user sees and does

2. **Use Descriptive Test Names**

   ```javascript
   // ❌ Bad
   test('login test', () => { ... });

   // ✅ Good
   test('displays error message when login fails', () => { ... });
   ```

3. **Follow the AAA Pattern**

   ```javascript
   test("should update username when input changes", async () => {
     // Arrange
     const user = userEvent.setup();
     render(<LoginForm />);

     // Act
     await user.type(screen.getByLabelText(/username/i), "newuser");

     // Assert
     expect(screen.getByLabelText(/username/i)).toHaveValue("newuser");
   });
   ```

4. **Clean Up Between Tests**
   ```javascript
   describe("LoginForm", () => {
     beforeEach(() => {
       // Reset mocks before each test
       jest.clearAllMocks();
     });
   });
   ```

#### 📁 File Naming Conventions

- `Component.test.js` - Tests for Component.js
- `Component.spec.js` - Alternative test file extension
- `__tests__/Component.js` - Tests in a **tests** folder

#### 🎉 Working Examples in This Project

- `App.simple.test.js` - Basic working test
- `auth/LoginForm.test.js` - Example component test
- `test-utils/test-helpers.js` - Reusable test utilities
- `jest-setup.test.js` - Basic Jest functionality tests

#### 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [JEST_GUIDE.md](../JEST_GUIDE.md) - Complete detailed guide
