import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog Component", () => {
  // Mock functions
  let mockOnConfirm;
  let mockOnCancel;

  beforeEach(() => {
    mockOnConfirm = jest.fn();
    mockOnCancel = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders when show is true", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
    });

    test("does not render when show is false", () => {
      render(
        <ConfirmDialog
          show={false}
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /yes/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /no/i })
      ).not.toBeInTheDocument();
    });

    test("returns null when show is false", () => {
      const { container } = render(
        <ConfirmDialog
          show={false}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Message Display", () => {
    test("displays the correct message", () => {
      const message = "Do you want to delete this item?";

      render(
        <ConfirmDialog
          show={true}
          message={message}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    test("displays long messages correctly", () => {
      const longMessage =
        "This is a very long confirmation message that should be displayed properly even though it contains a lot of text and might wrap to multiple lines in the modal dialog.";

      render(
        <ConfirmDialog
          show={true}
          message={longMessage}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    test("handles empty message", () => {
      render(
        <ConfirmDialog
          show={true}
          message=""
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Should still render the modal structure
      expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
    });

    test("handles special characters in message", () => {
      const specialMessage =
        "Delete item: @#$%^&*() \"quotes\" and 'apostrophes'?";

      render(
        <ConfirmDialog
          show={true}
          message={specialMessage}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe("Button Functionality", () => {
    test("calls onConfirm when confirm button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          show={true}
          message="Confirm action?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole("button", { name: /yes/i }));

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    test("calls onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          show={true}
          message="Confirm action?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole("button", { name: /no/i }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    test("buttons work with fireEvent", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Confirm action?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /yes/i }));
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: /no/i }));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Custom Button Text", () => {
    test("uses default button text when not provided", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Confirm?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
    });

    test("displays custom confirm text", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Delete item?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText="Delete"
          cancelText="Keep"
        />
      );

      expect(
        screen.getByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Yes" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "No" })
      ).not.toBeInTheDocument();
    });

    test("handles partial custom text (only confirmText)", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Save changes?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText="Save"
        />
      );

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument(); // Default cancel text
    });

    test("handles partial custom text (only cancelText)", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Continue?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          cancelText="Cancel"
        />
      );

      expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument(); // Default confirm text
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    test("handles empty custom text", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Proceed?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText=""
          cancelText=""
        />
      );

      // Should still render buttons even with empty text
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });

  describe("Bootstrap Integration", () => {
    test("applies correct Bootstrap modal classes", () => {
      const { container } = render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modal = container.querySelector(".modal");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass("modal", "d-block");

      expect(container.querySelector(".modal-dialog")).toBeInTheDocument();
      expect(
        container.querySelector(".modal-dialog-centered")
      ).toBeInTheDocument();
      expect(container.querySelector(".modal-content")).toBeInTheDocument();
      expect(container.querySelector(".modal-body")).toBeInTheDocument();
    });

    test("applies correct Bootstrap button classes", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const confirmButton = screen.getByRole("button", { name: /yes/i });
      const cancelButton = screen.getByRole("button", { name: /no/i });

      expect(confirmButton).toHaveClass("btn", "btn-danger", "me-2");
      expect(cancelButton).toHaveClass("btn", "btn-secondary");
    });

    test("applies correct flexbox classes", () => {
      const { container } = render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const buttonContainer = container.querySelector(".d-flex");
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass("d-flex", "justify-content-end");
    });
  });

  describe("Modal Properties", () => {
    test("sets correct modal attributes", () => {
      const { container } = render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modal = container.querySelector(".modal");
      expect(modal).toHaveAttribute("tabIndex", "-1");
    });

    test("applies backdrop styling", () => {
      const { container } = render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modal = container.querySelector(".modal");
      expect(modal).toHaveStyle({ background: "rgba(0,0,0,0.5)" });
    });
  });

  describe("Component Integration", () => {
    test("can be used for delete confirmation", async () => {
      const user = userEvent.setup();
      let itemDeleted = false;

      const handleDelete = () => {
        itemDeleted = true;
      };

      render(
        <ConfirmDialog
          show={true}
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={mockOnCancel}
          confirmText="Delete"
          cancelText="Cancel"
        />
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(itemDeleted).toBe(true);
    });

    test("can be used for save confirmation", async () => {
      const user = userEvent.setup();
      let changesSaved = false;

      const handleSave = () => {
        changesSaved = true;
      };

      render(
        <ConfirmDialog
          show={true}
          message="Do you want to save your changes?"
          onConfirm={handleSave}
          onCancel={mockOnCancel}
          confirmText="Save"
          cancelText="Discard"
        />
      );

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(changesSaved).toBe(true);
    });

    test("can be used for logout confirmation", async () => {
      const user = userEvent.setup();
      let userLoggedOut = false;

      const handleLogout = () => {
        userLoggedOut = true;
      };

      render(
        <ConfirmDialog
          show={true}
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={mockOnCancel}
          confirmText="Log Out"
          cancelText="Stay"
        />
      );

      await user.click(screen.getByRole("button", { name: "Log Out" }));

      expect(userLoggedOut).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    test("handles missing onConfirm prop gracefully", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onCancel={mockOnCancel}
        />
      );

      const confirmButton = screen.getByRole("button", { name: /yes/i });

      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(confirmButton);
      }).not.toThrow();
    });

    test("handles missing onCancel prop gracefully", () => {
      render(
        <ConfirmDialog
          show={true}
          message="Test message"
          onConfirm={mockOnConfirm}
        />
      );

      const cancelButton = screen.getByRole("button", { name: /no/i });

      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(cancelButton);
      }).not.toThrow();
    });

    test("handles missing message prop", () => {
      render(
        <ConfirmDialog
          show={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Should still render buttons
      expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
    });

    test("handles null/undefined show prop", () => {
      const { rerender } = render(
        <ConfirmDialog
          show={null}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Test message")).not.toBeInTheDocument();

      rerender(
        <ConfirmDialog
          show={undefined}
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("modal has correct tabIndex for accessibility", () => {
      const { container } = render(
        <ConfirmDialog
          show={true}
          message="Accessible dialog"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modal = container.querySelector(".modal");
      expect(modal).toHaveAttribute("tabIndex", "-1");
    });

    test("buttons are accessible via keyboard", async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          show={true}
          message="Keyboard accessible"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const confirmButton = screen.getByRole("button", { name: /yes/i });
      const cancelButton = screen.getByRole("button", { name: /no/i });

      // Tab to first button and press Enter
      await user.tab();
      expect(confirmButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);

      // Clear mock and test cancel button
      mockOnConfirm.mockClear();

      await user.tab();
      expect(cancelButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test("buttons can be activated with Space key", async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          show={true}
          message="Space key test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const confirmButton = screen.getByRole("button", { name: /yes/i });
      confirmButton.focus();

      await user.keyboard(" ");
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component State Changes", () => {
    test("responds to show prop changes", () => {
      const { rerender } = render(
        <ConfirmDialog
          show={false}
          message="Toggle test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Toggle test")).not.toBeInTheDocument();

      rerender(
        <ConfirmDialog
          show={true}
          message="Toggle test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Toggle test")).toBeInTheDocument();

      rerender(
        <ConfirmDialog
          show={false}
          message="Toggle test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Toggle test")).not.toBeInTheDocument();
    });

    test("updates message when prop changes", () => {
      const { rerender } = render(
        <ConfirmDialog
          show={true}
          message="Original message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Original message")).toBeInTheDocument();

      rerender(
        <ConfirmDialog
          show={true}
          message="Updated message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Updated message")).toBeInTheDocument();
      expect(screen.queryByText("Original message")).not.toBeInTheDocument();
    });

    test("updates button text when props change", () => {
      const { rerender } = render(
        <ConfirmDialog
          show={true}
          message="Button text test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText="Original Confirm"
          cancelText="Original Cancel"
        />
      );

      expect(
        screen.getByRole("button", { name: "Original Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Original Cancel" })
      ).toBeInTheDocument();

      rerender(
        <ConfirmDialog
          show={true}
          message="Button text test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText="New Confirm"
          cancelText="New Cancel"
        />
      );

      expect(
        screen.getByRole("button", { name: "New Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "New Cancel" })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Original Confirm" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Original Cancel" })
      ).not.toBeInTheDocument();
    });
  });
});
