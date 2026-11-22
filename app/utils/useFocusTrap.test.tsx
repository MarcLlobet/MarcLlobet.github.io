import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

const Dialog = ({
  onClose,
  active,
}: {
  onClose: () => void;
  active?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose, active);
  return (
    <div ref={ref}>
      <button>First</button>
      <button>Last</button>
    </div>
  );
};

describe("useFocusTrap", () => {
  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(<Dialog onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("wraps Tab from the last focusable element to the first", async () => {
    render(<Dialog onClose={vi.fn()} />);
    screen.getByText("Last").focus();
    await userEvent.tab();
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps Shift+Tab from the first focusable element to the last", async () => {
    render(<Dialog onClose={vi.fn()} />);
    screen.getByText("First").focus();
    await userEvent.tab({ shift: true });
    expect(screen.getByText("Last")).toHaveFocus();
  });

  it("does nothing while inactive", async () => {
    const onClose = vi.fn();
    render(<Dialog onClose={onClose} active={false} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });
});
