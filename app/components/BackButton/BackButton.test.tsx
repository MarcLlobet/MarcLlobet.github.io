import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BackButton } from "./BackButton";

const back = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back, push }),
}));

vi.mock("../../utils/pageTransition", () => ({
  requestPageExit: vi.fn().mockResolvedValue(undefined),
}));

describe("BackButton", () => {
  beforeEach(() => {
    sessionStorage.clear();
    back.mockClear();
    push.mockClear();
  });

  it("pushes home — never back(), which would carry a stale #section hash that fights the restore", async () => {
    Object.defineProperty(window, "scrollY", {
      value: 500,
      configurable: true,
    });
    const { rememberScroll } = await import("../../utils/returnNav");
    rememberScroll();

    render(<BackButton />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/", { scroll: false }),
    );
    expect(back).not.toHaveBeenCalled();
  });

  it("pushes home the same way with nothing remembered (opened directly)", async () => {
    render(<BackButton />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/", { scroll: false }),
    );
    expect(back).not.toHaveBeenCalled();
  });

  it("arms the pending restore before navigating, when a scroll position was remembered", async () => {
    Object.defineProperty(window, "scrollY", {
      value: 650,
      configurable: true,
    });
    const { rememberScroll, consumeReturnScroll } =
      await import("../../utils/returnNav");
    rememberScroll();

    render(<BackButton />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(consumeReturnScroll()).toBe(650);
  });
});
